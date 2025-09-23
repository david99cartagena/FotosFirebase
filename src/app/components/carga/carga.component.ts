import { Component } from '@angular/core';
import { FileItem } from 'src/app/models/file-item';
import { CargaImagenesService } from 'src/app/services/carga-imagenes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css'],
})
export class CargaComponent {
  estaSobreElemento: boolean = false;
  archivos: FileItem[] = [];

  constructor(public cargaImagenes: CargaImagenesService) {}

  cargarImagenes() {
    this.cargaImagenes.cargarImagenesFirebase(this.archivos);
  }

  /* pruebaSobreElemento(event: any) {
    console.log('Elemento sobre el que se arrastra el archivo:', event);
  } */

  /* limpiarArchivos() {
    this.archivos = [];
  } */

  limpiarArchivos() {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esto eliminará todos los archivos seleccionados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.archivos = [];
        Swal.fire(
          'Eliminados',
          'Todos los archivos fueron limpiados.',
          'success'
        );
      }
    });
  }
}
