export class FileItem {
  public archivo: File | undefined;
  public nombreArchivo: string | undefined;
  public url: string | undefined;
  public estaSubiendo: boolean | undefined;
  public progreso: number | undefined;

  constructor(archivo: File) {
    this.archivo = archivo;
    this.nombreArchivo = archivo.name;
    this.estaSubiendo = false;
    this.progreso = 0;
  }
}
