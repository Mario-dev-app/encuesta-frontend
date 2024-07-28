import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EncuestaService } from '../../services/encuesta.service';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    MenubarModule,
    CardModule,
    CommonModule,
    CalendarModule,
    FormsModule,
    ToastModule,
    TableModule,
    ProgressBarModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  providers: [MessageService]
})
export class ReportComponent {

  items: MenuItem[] | undefined;

  desde!: Date | undefined;
  hasta!: Date | undefined;


  buscadoRespuestas: boolean = false;

  excelButtonDisabled: boolean = true;

  encuestas: any = [];


  isLoading: boolean = false;

  constructor(
    private messageService: MessageService,
    private encuestaService: EncuestaService
  ) { }

  presentToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }

  buscarRespuestas() {
    this.isLoading = true;
    if (!this.desde || !this.hasta) {
      this.presentToast('warn', 'Warning', 'Debe completar las fechas para buscar');
      this.isLoading = false;
      this.excelButtonDisabled = true;
      return;
    }
    
    if(this.desde.getTime() > this.hasta.getTime()) {
      this.presentToast('warn', 'Warning', '"Desde" no puede ser menor a "Hasta"');
      this.isLoading = false;
      this.excelButtonDisabled = true;
      return;
    }

    this.buscadoRespuestas = true;
    this.excelButtonDisabled = false;

    const desdeString = this.formatDate(this.desde);
    const hastaString = this.formatDate(this.hasta);
    this.encuestaService.buscarEncuestaPorFechas(desdeString, hastaString).subscribe(({resp}: any) => {
      this.encuestas = resp;
      if(resp.length === 0) {
        this.presentToast('info', 'Info', 'No se encontraron registros entre esas fechas');
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.presentToast('error', 'Error', err.error.message);
    })
  }

  limpiarRespuestas() {
    this.desde = undefined;
    this.hasta = undefined;
    this.excelButtonDisabled = true;
    this.buscadoRespuestas = false;
    this.encuestas = [];
  }

  descargarExcelRespuestas() {
    this.isLoading = true;
    if (!this.buscadoRespuestas) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Aún no ha realizado ninguna búsqueda' });
      this.isLoading = false;
      return;
    }

    if (!this.desde || !this.hasta) {
      this.presentToast('warn', 'Warning', 'Deben haber fechas seleccionadas para generar el archiv de Excel');
      this.isLoading = false;
      return;
    }

    const url = `${environment.base_url_prod}/excel-report?fechaInicio=${this.formatDate(this.desde)}&fechaFin=${this.formatDate(this.hasta)}`
    this.isLoading = false;
    window.open(url, '_blank');
  }


  formatDate(date: Date) {
    let dayString = `${date.getDate()}`;
    dayString = (dayString.length === 1) ? `0${dayString}` : dayString;

    let monthString = `${date.getMonth() + 1}`;
    monthString = (monthString.length === 1) ? `0${monthString}` : monthString;

    let yearString = `${date.getFullYear()}`;

    return `${yearString}-${monthString}-${dayString}`;
  }

}
