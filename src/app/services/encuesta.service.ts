import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor(
    private http: HttpClient
  ) { }

  registrarEncuesta(body: any) {
    return this.http.post(`${environment.base_url_prod}/encuesta`, body);
  }

  buscarEncuestaPorFechas(desde: string, hasta: string) {
    return this.http.get(`${environment.base_url_prod}/encuestas?fechaInicio=${desde}&fechaFin=${hasta}`);
  }

  buscarRegistroDeEnvioPorFechas(desde: string, hasta: string) {
    return this.http.get(`${environment.base_url_prod}/registro-correo?fechaInicio=${desde}&fechaFin=${hasta}`);
  }
}
