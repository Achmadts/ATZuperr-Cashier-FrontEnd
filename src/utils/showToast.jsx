import { toast } from "react-toastify";

const showToast = (message, type = "success") => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error") {
    toast.error(message, options);
  } else if (type === "info") {
    toast.info(message, options);
  } else if (type === "warning") {
    toast.warning(message, options);
  } else {
    toast(message, options);
  }
};

export default showToast;
