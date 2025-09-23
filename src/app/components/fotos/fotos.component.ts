import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { CargaImagenesService } from 'src/app/services/carga-imagenes.service';
import Swal from 'sweetalert2';

export interface Item {
  id?: string;
  nombre: string;
  url: string;
}

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.css'],
})
export class FotosComponent {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]> | undefined;

  constructor(
    private afs: AngularFirestore,
    private cargaService: CargaImagenesService
  ) {
    this.itemsCollection = afs.collection<Item>('img');
    this.cargarItems();
  }

  cargarItems() {
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Item;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  eliminar(item: Item) {
    Swal.fire({
      title: `¿Deseas eliminar la imagen "${item.nombre}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed && item.id) {
        this.cargaService
          .eliminarImagen(item.id, item.nombre)
          .then(() => {
            Swal.fire({
              title: 'Eliminada',
              text: `La imagen "${item.nombre}" fue eliminada correctamente.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarItems();
          })
          .catch((error) => {
            Swal.fire(
              'Error',
              `No se pudo eliminar la imagen: ${error.message}`,
              'error'
            );
          });
      }
    });
  }
}
