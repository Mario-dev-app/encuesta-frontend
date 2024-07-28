import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/* PRIMENG */
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EncuestaService } from '../../services/encuesta.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ProgressBarModule,
    ReactiveFormsModule,
    MessagesModule,
    ButtonModule,
    InputTextareaModule,
    ToastModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [MessageService]
})
export class FormComponent implements OnInit {

  formLoading: boolean = false;

  fiveChecks = [1, 2, 3, 4, 5];

  tenChecks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  servicioForm = new FormGroup({
    primera: new FormControl('', [Validators.required]),
    segunda: new FormControl('', [Validators.required]),
    tercera: new FormControl('', [Validators.required]),
    cuarta: new FormControl('', [Validators.required]),
    quinta: new FormControl('', [Validators.required]),
    sexta: new FormControl('', [Validators.required])
  });

  private encuestaService = inject(EncuestaService);

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() { }

  servicioFormSubmit() {
    this.formLoading = true;
    if (!this.servicioForm?.valid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formulario no válido. Complete todos los campos.' });
      this.formLoading = false;
      return;
    }

    const primera = this.servicioForm.controls['primera'].value;
    const segunda = this.servicioForm.controls['segunda'].value;
    const tercera = this.servicioForm.controls['tercera'].value;
    const cuarta = this.servicioForm.controls['cuarta'].value;
    const quinta = this.servicioForm.controls['quinta'].value;
    const sexta = this.servicioForm.controls['sexta'].value;

    const preguntas = {
      pregunta_1: primera,
      pregunta_2: segunda,
      pregunta_3: tercera,
      pregunta_4: cuarta,
      pregunta_5: quinta,
      pregunta_6: sexta
    }

    const body = {
      preguntas
    }

    this.encuestaService.registrarEncuesta(body).subscribe((resp) => {
      this.servicioForm.reset();
      this.formLoading = false;
      this.router.navigateByUrl('success');
    }, (err) => {
      this.formLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
    });
  }

}
