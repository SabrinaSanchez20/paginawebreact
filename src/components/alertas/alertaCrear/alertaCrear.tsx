import Swal from "sweetalert2";

export function alertaCrear() {
  Swal.fire({
    icon: "success",
    title: "¡Creado!",
    text: "El registro se creó correctamente.",
    confirmButtonColor: "#198754",
    confirmButtonText: "Aceptar"
  });
}