// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import Navbar from "../../../assets/components/Navbar";
import SideBar from "../../../assets/components/Sidebar";
import { SearchOutlined, AddOutlined } from "@mui/icons-material";
import endpoints from "../../../constants/apiEndpoint";
import showToast from "../../../utils/showToast";
import Modal from "react-modal";
Modal.setAppElement("#root");

function SalesCreate() {
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    customer: "",
    date: new Date().toISOString().split("T")[0],
    products: [],
    discount: 0,
    tax: 10,
    grandTotal: 0,
    status: "Pending",
    paymentMethod: "Cash",
    amountReceived: "",
    note: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");
    const currentTime = new Date().getTime();
    const interactionTime = parseInt(lastInteraction, 10);

    if (!token || !lastInteraction) {
      navigate("/");
      return;
    }

    if (currentTime - interactionTime > 60 * 60 * 1000) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("last_interaction");
      navigate("/");
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${endpoints.product}?searchTerm=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data.data)) {
        setProducts(result.data.data);
        const initialQuantities = result.data.data.reduce((acc, product) => {
          acc[product.id] = 0;
          return acc;
        }, {});
        setQuantities(initialQuantities);
      } else {
        console.error("Data fetched is not an array:", result.data);
        setProducts([]);
      }
    } catch (error) {
      console.error(error);
      showToast("Gagal mengambil data Produk.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (productId, value) => {
    let updatedValue = value.replace(/^0+/, "");

    if (updatedValue === "") {
      updatedValue = "0";
    }

    const validValue = Math.min(
      Math.max(Number(updatedValue), 0),
      products.find((p) => p.id === productId).stok
    );

    setQuantities((prev) => ({
      ...prev,
      [productId]: validValue,
    }));
  };

  function handleUpdateQuantity(productId, newQuantity) {
    setAddedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  }

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setOpenModalDelete(true);
  };

  const closeDeleteModal = () => {
    setOpenModalDelete(false);
    setSelectedProduct(null);
  };

  const handleRemoveProduct = (productId) => {
    setAddedProducts((prevProducts) => {
      const productToRemove = prevProducts.find(
        (product) => product.id === productId
      );

      if (productToRemove) {
        showToast(
          `Successfully deleted ${productToRemove.nama_produk}!`,
          "info"
        );
      }
      return prevProducts.filter((product) => product.id !== productId);
    });

    closeDeleteModal();
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addProduct = (product) => {
    const quantity = quantities[product.id];
    if (quantity === 0) {
      showToast(
        `Please set a valid quantity for ${product.nama_produk}!`,
        "error"
      );
      return;
    }

    const subtotal = product.harga_jual * quantity;

    setAddedProducts((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(
        (p) => p.id === product.id
      );

      if (existingProductIndex !== -1) {
        const existingProduct = prevProducts[existingProductIndex];

        if (existingProduct.quantity !== quantity) {
          const updatedProducts = [...prevProducts];
          updatedProducts[existingProductIndex] = {
            ...existingProduct,
            quantity,
            subtotal,
          };

          setTimeout(() => {
            showToast(`Updated quantity for ${product.nama_produk}!`, "info");
          }, 0);
          return updatedProducts;
        }

        return prevProducts;
      }

      showToast(`Product ${product.nama_produk} added!`, "success");
      return [
        ...prevProducts,
        {
          ...product,
          quantity,
          subtotal,
        },
      ];
    });

    setFormData((prevFormData) => {
      const existingFormProductIndex = prevFormData.products.findIndex(
        (p) => p.id === product.id
      );

      if (existingFormProductIndex !== -1) {
        const updatedProducts = [...prevFormData.products];
        updatedProducts[existingFormProductIndex] = {
          ...updatedProducts[existingFormProductIndex],
          quantity,
          subtotal,
        };
        return {
          ...prevFormData,
          products: updatedProducts,
        };
      }

      return {
        ...prevFormData,
        products: [
          ...prevFormData.products,
          {
            ...product,
            quantity,
            subtotal,
          },
        ],
      };
    });
  };

  const calculateSubTotal = () => {
    return addedProducts.reduce((total, product) => {
      return total + product.harga_jual * product.quantity;
    }, 0);
  };

  const calculateTax = () => {
    const subTotal = calculateSubTotal();
    return (formData.tax / 100) * subTotal;
  };

  const calculateDiscountAfterTax = () => {
    const subTotalWithTax = calculateSubTotal() + calculateTax();
    return (formData.discount / 100) * subTotalWithTax;
  };

  const calculateGrandTotal = () => {
    const subTotal = calculateSubTotal();
    const tax = calculateTax();
    const discountAfterTax = calculateDiscountAfterTax();
    return subTotal + tax - discountAfterTax;
  };

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden">
      <SideBar />
      <div className="flex-1 bg-gray-100 p-4 sm:p-6">
        <Navbar />
        {isLoading ? (
          <div className="max-w-full mx-auto bg-white shadow rounded-lg p-6 mb-6">
            <div className="form-control">
              <Skeleton variant="rectangular" height={48} className="w-full" />
            </div>
          </div>
        ) : (
          <div className="max-w-full mx-auto bg-white shadow rounded-lg p-6 mb-6">
            <div className="form-control relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <SearchOutlined />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
                placeholder="Type product name or code..."
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
        )}

        <div className="max-w-full mx-auto bg-white shadow rounded-lg pt-3 pb-6 pl-6 pr-6">
          {isLoading ? (
            <div className="flex flex-col gap-4 mb-6 md:flex-row">
              <div className="flex-1">
                <Skeleton variant="text" width={120} height={36} />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="w-full mt-2"
                />
              </div>
              <div className="flex-1">
                <Skeleton variant="text" width={50} height={36} />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="w-full mt-2"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-6 md:flex-row">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text">
                    Customer Name <span className="text-red-600">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.customer}
                  name="customer"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text">
                    Date <span className="text-red-600">*</span>
                  </span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={formData.date}
                  name="date"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            {isLoading ? (
              <table className="table w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th>
                      <Skeleton variant="text" width="80%" height={20} />
                    </th>
                    <th>
                      <Skeleton variant="text" width="80%" height={20} />
                    </th>
                    <th>
                      <Skeleton variant="text" width="80%" height={20} />
                    </th>
                    <th>
                      <Skeleton variant="text" width="80%" height={20} />
                    </th>
                    <th>
                      <Skeleton variant="text" width="80%" height={20} />
                    </th>
                    <th>
                      <Skeleton variant="text" width="80%" height={20} />
                    </th>
                    <th>
                      <Skeleton variant="text" width="80%" height={20} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Skeleton variant="text" width="820%" height={20} />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="table w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th>Product</th>
                    <th>Net Unit Price</th>
                    <th>Stock</th>
                    <th>Quantity</th>
                    <th>Sub Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6">
                        <Skeleton variant="rectangular" height={40} />
                      </td>
                    </tr>
                  ) : searchTerm === "" ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <span className="text-red-600">
                          Please search & select products!
                        </span>
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((product) => {
                      const quantity = quantities[product.id] || 0;
                      const remainingStock = product.stok - quantity;
                      const subtotal = product.harga_jual * quantity;

                      return (
                        <tr
                          key={product.id}
                          className={remainingStock === 0 ? "bg-gray-300" : ""}
                        >
                          <td>{product.nama_produk}</td>
                          <td>{`Rp. ${product.harga_jual.toLocaleString(
                            "id-ID"
                          )}`}</td>
                          <td>{remainingStock}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={quantity}
                              onChange={(e) =>
                                handleQuantityChange(product.id, e.target.value)
                              }
                              className="input input-bordered w-20 h-10"
                            />
                          </td>
                          <td>{`Rp. ${subtotal.toLocaleString("id-ID")}`}</td>
                          <td>
                            <button
                              className="btn btn-primary text-white"
                              onClick={() => addProduct(product)}
                              disabled={quantity === 0}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <span className="text-red-600">No products found!</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col md:flex-row justify-end mt-6 mb-4 gap-4">
              <div className="w-full md:w-2/3 bg-gray-50 border rounded-lg p-4">
                <Skeleton
                  variant="text"
                  width="20%"
                  height={30}
                  className="mb-4"
                />
                <ul className="mt-3">
                  <Skeleton variant="text" width="25%" height={24} />
                </ul>
              </div>

              <div className="w-full md:w-1/3 bg-gray-200 border rounded-lg">
                <div className="border-b px-4 py-2 flex justify-between">
                  <Skeleton variant="text" width="50%" height={24} />
                  <Skeleton variant="text" width="30%" height={24} />
                </div>
                <div className="border-b px-4 py-2 flex justify-between">
                  <Skeleton variant="text" width="50%" height={24} />
                  <Skeleton variant="text" width="30%" height={24} />
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <Skeleton variant="text" width="40%" height={28} />
                  <Skeleton variant="text" width="30%" height={28} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-end mt-6 mb-4 gap-4">
              <div className="w-full md:w-2/3 bg-gray-50 border rounded-lg p-4 max-h-36 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">Added Products</h2>
                {addedProducts.length > 0 ? (
                  <div>
                    <ul>
                      {addedProducts.map((product) => (
                        <li
                          key={product.id}
                          className="flex justify-between items-center mb-2 border-b pb-2"
                        >
                          <div className="flex items-center gap-2">
                            <AddOutlined
                              className="cursor-pointer text-blue-500"
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.id,
                                  product.quantity + 1
                                )
                              }
                            />
                            <span className="text-gray-600">
                              {product.nama_produk}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{`Qty: ${
                              product.quantity || 0
                            } x Rp. ${product.harga_jual.toLocaleString(
                              "id-ID"
                            )}`}</span>
                            <button
                              className="px-2 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400"
                              onClick={() => {
                                if (product.quantity === 1) {
                                  openDeleteModal(product);
                                } else {
                                  handleUpdateQuantity(
                                    product.id,
                                    product.quantity - 1
                                  );
                                }
                              }}
                            >
                              -
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Modal
                      isOpen={openModalDelete}
                      onRequestClose={closeDeleteModal}
                      contentLabel="Delete Confirmation"
                      ariaHideApp={false}
                      className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto"
                      overlayClassName="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center"
                    >
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Produk akan dihapus dari pesanan! Apakah Anda yakin?
                      </h2>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() =>
                            handleRemoveProduct(selectedProduct?.id)
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                        >
                          Yes, Remove
                        </button>
                        <button
                          onClick={closeDeleteModal}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </Modal>
                  </div>
                ) : (
                  <p className="text-red-600">No products added yet.</p>
                )}
              </div>

              <div className="w-full md:w-1/3 bg-gray-200 border rounded-lg">
                <div className="border-b px-4 py-2 flex justify-between">
                  <span className="text-gray-600">
                    Tax ({formData.tax || 0}%)
                  </span>
                  <span className="text-gray-600">
                    (+) Rp. {calculateTax().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="border-b px-4 py-2 flex justify-between">
                  <span className="text-gray-600">
                    Discount ({formData.discount || 0}%)
                  </span>
                  <span className="text-gray-600">
                    (-) Rp.{" "}
                    {calculateDiscountAfterTax().toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="px-4 py-2 flex justify-between font-bold text-lg">
                  <span>Grand Total</span>
                  <span>
                    (=) Rp. {calculateGrandTotal().toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <Skeleton variant="text" width={140} height={36} />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="w-full mt-2"
                />
              </div>
              <div className="flex-1">
                <Skeleton variant="text" width={50} height={36} />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="w-full mt-2"
                />
              </div>
              <div className="flex-1">
                <Skeleton variant="text" width={116} height={36} />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="w-full mt-2"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <label className="label">
                  <span className="label-text">Discount after Tax (%)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  name="discount"
                  value={formData.discount}
                  onChange={(e) => {
                    let value = e.target.value;

                    if (
                      (value.startsWith("0") && value.length > 1) ||
                      value.length > 1
                    ) {
                      value = value.replace(/^0+/, "");
                    }

                    if (Number(value) > 100) {
                      value = "100";
                    }

                    if (value === "" || Number(value) < 1) {
                      value = "0";
                    }

                    handleInputChange({
                      target: { name: e.target.name, value },
                    });
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text">
                    Status <span className="text-red-600">*</span>
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="label">
                  <span className="label-text">
                    Payment Method <span className="text-red-600">*</span>
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="mt-3">
                  <Skeleton variant="text" width={57} height={36} />
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    className="w-full mt-2"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="mt-3">
                  <Skeleton variant="text" width={104} height={36} />
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="mt-3">
                  <label className="label">
                    <span className="label-text">
                      Tax (%) <span className="text-red-600">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    name="tax"
                    value={formData.tax}
                    onChange={(e) => {
                      let value = e.target.value;

                      if (value.startsWith("0") && value.length > 1) {
                        value = value.replace(/^0+/, "");
                      }

                      if (Number(value) > 100) {
                        value = "100";
                      }

                      handleInputChange({
                        target: { name: e.target.name, value },
                      });
                    }}
                    onBlur={(e) => {
                      let value = e.target.value;

                      if (value === "" || Number(value) < 10) {
                        value = "10";
                      }

                      handleInputChange({
                        target: { name: e.target.name, value },
                      });
                    }}
                    max="100"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="mt-3">
                  <label className="label">
                    <span className="label-text">Note (If Needed)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-12"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="mt-6">
              <Skeleton variant="rectangular" height={40} className="w-full" />
            </div>
          ) : (
            <div className="mt-6">
              <button className="btn btn-primary w-full text-white">
                Create Sales
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesCreate;
