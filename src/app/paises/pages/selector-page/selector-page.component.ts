import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  procesando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ps: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones = this.ps.regiones;

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(() => {
          this.miFormulario.get('pais')?.reset('');
          this.procesando = true;
        }),
        switchMap(region => this.ps.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.procesando = false;
      });

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.procesando = true;
        }),
        switchMap(codigo => this.ps.getPaisPorCodigo(codigo)),
        switchMap(pais => this.ps.getPaisesPorCodigos(pais?.borders!))
      )
      .subscribe(paises => {
        // this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        this.procesando = false;
      })
  }

  guardar() {
    console.log(this.miFormulario.value)
  }


}
