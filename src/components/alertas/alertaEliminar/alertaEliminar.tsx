import Swal from "sweetalert2";
import "./alertaEliminar.css";

export function alertaEliminar(onConfirm: () => void) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: "El registro se eliminó correctamente.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar"
      });
    }
  });
}