import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatService {
  private patsDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private actividadEstrategicas: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {
  }

  crearPat<T>(pat : any,headers?: HttpHeaders):Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/ccoa/pats`,pat,{headers});
  }

  listarPat<T>(headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/ccoa/pats`, { headers })
      .pipe(
        tap((pats: any) => {
          this.setPatsData(pats); // Al recibir los datos, guardarlos en el BehaviorSubject
        })
      );
  }
  listarPatPorId<T>(idPat:number,headers?: HttpHeaders){
    return this.http.get(`${environment.apiUrl}/ccoa/pats/${idPat}`,{headers});
  }
  modificarPat<T>(pat : any,idPat:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/pats/${idPat}`,pat,{headers});
  }
  eliminarPat<T>(idPat:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/pats/${idPat}`,{headers});
  }

  crearObservacion(observacion : any,headers?: HttpHeaders): Observable<any[]>{
    return this.http.post<any[]>(`${environment.apiUrl}/ccoa/pat/observaciones`,observacion,{headers});
  }
  listarObservacion(headers?: HttpHeaders): Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/pat/observaciones`,{headers});
  }
  listarObservacionPorId(idObservacion:number,headers?: HttpHeaders) : Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/pat/observaciones/${idObservacion}`,{headers});
  }
  listarObservacionPorIdPat(idPat: number, headers?: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ccoa/pat/observaciones/pats/${idPat}`, { headers });
  }

  getPatsData(): Observable<any[]> {
    return this.patsDataSubject.asObservable();
  }

  setPatsData(pats: any[]): void {
    this.patsDataSubject.next(pats);
  }

  getActividadesEstrategicas(): Observable<number> {
    return this.actividadEstrategicas.asObservable() as Observable<number>;
  }

  setActividadesEstrategicas(actividades: number): void {
    this.actividadEstrategicas.next(actividades);
  }

}
