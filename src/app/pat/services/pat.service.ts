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
  private actividadEstrategicasPendientes: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private proyectos: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private proyectosPendientes: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private proyectosArea: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private proyectosPendientesArea: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {
  }

  crearPat<T>(pat : any,headers?: HttpHeaders):Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/ccoa/pats`,pat,{headers});
  }

  listarPat<T>(headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/ccoa/pats`, { headers })
      .pipe(
        tap((pats: any) => {
          this.setPatsAsociados(pats); // Al recibir los datos, guardarlos en el BehaviorSubject
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
  modificarObservacionPat<T>(observacionPat : any,idObservacionPat:number,headers?: HttpHeaders):Observable<T>{
    return this.http.put<T>(`${environment.apiUrl}/ccoa/pat/observaciones/${idObservacionPat}`,observacionPat,{headers});
  }
  eliminarObservacionPat<T>(idObservacionPat:number,headers?: HttpHeaders):Observable<T>{
    return this.http.delete<T>(`${environment.apiUrl}/ccoa/pat/observaciones/${idObservacionPat}`,{headers});
  }


  getPatsAsociados(): Observable<any[]> {
    return this.patsDataSubject.asObservable();
  }

  setPatsAsociados(pats: any[]): void {
    this.patsDataSubject.next(pats);
  }

  getActividadesEstrategicas(): Observable<number> {
    return this.actividadEstrategicas.asObservable() as Observable<number>;
  }

  setActividadesEstrategicas(actividades: number): void {
    this.actividadEstrategicas.next(actividades);
  }

  getActividadesEstrategicasPendientes(): Observable<number> {
    return this.actividadEstrategicasPendientes.asObservable() as Observable<number>;
  }

  setActividadesEstrategicasPendientes(actividades: number): void {
    this.actividadEstrategicasPendientes.next(actividades);
  }
  getProyectos(): Observable<number> {
    return this.proyectos.asObservable() as Observable<number>;
  }

  setProyectos(actividades: number): void {
    this.proyectos.next(actividades);
  }
  getProyectosPendientes(): Observable<number> {
    return this.proyectosPendientes.asObservable() as Observable<number>;
  }

  setProyectosPendientes(actividades: number): void {
    this.proyectosPendientes.next(actividades);
  }
  getProyectosArea(): Observable<number> {
    return this.proyectosArea.asObservable() as Observable<number>;
  }

  setProyectosArea(actividades: number): void {
    this.proyectosArea.next(actividades);
  }
  getProyectosPendientesArea(): Observable<number> {
    return this.proyectosPendientesArea.asObservable() as Observable<number>;
  }

  setProyectosPendientesArea(actividades: number): void {
    this.proyectosPendientesArea.next(actividades);
  }

}
