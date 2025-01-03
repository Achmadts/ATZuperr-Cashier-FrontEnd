// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import Navbar from "../../../assets/components/Navbar";
import SideBar from "../../../assets/components/Sidebar";
import endpoints from "../../../constants/apiEndpoint";
import showToast from "../../../utils/showToast";
import Modal from "react-modal";
Modal.setAppElement("#root");

function SalesDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [addedProducts, setAddedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchSaleData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${endpoints.sale}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sales data.");
        }

        const result = await response.json();
        if (result.success) {
          const totalHarga = parseFloat(result.data.total_harga || 0);
          const taxValue = parseFloat(result.data.pajak || 0);
          const discountValue = parseFloat(result.data.diskon || 0);
          const hargaSetelahPajak = totalHarga + discountValue;

          const taxPercentage = (
            (taxValue / (hargaSetelahPajak - taxValue)) *
            100
          ).toFixed(2);

          const discountPercentage = (
            (discountValue / hargaSetelahPajak) *
            100
          ).toFixed(2);

          setFormData({
            customer: result.data.nama_pelanggan || "",
            date: result.data.tanggal_penjualan || "",
            discount: parseFloat(discountPercentage),
            tax: parseFloat(taxPercentage),
            grandTotal: totalHarga,
            status: result.data.status || "Pending",
            paymentMethod: result.data.metode_pembayaran || "Cash",
            note: result.data.catatan || "",
          });

          const mappedProducts = result.data.detail_penjualans.map(
            (product) => ({
              id: product.id,
              id_produk: product.id_produk,
              nama_produk: product.nama_produk,
              quantity: product.jumlah_produk,
              harga_jual: parseFloat(product.sub_total) / product.jumlah_produk,
              subtotal: parseFloat(product.sub_total),
            })
          );

          setAddedProducts(mappedProducts);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        showToast("Gagal mengambil data penjualan.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleData();
  }, [id]);

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
        <form>
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
                    className="input input-bordered w-full cursor-not-allowed"
                    value={formData.customer}
                    name="customer"
                    autoComplete="off"
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
                    className="input input-bordered w-full cursor-not-allowed"
                    value={formData.date}
                    name="date"
                  />
                </div>
              </div>
            )}

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
                            </div>
                          </li>
                        ))}
                      </ul>
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
                    className="input input-bordered w-full cursor-not-allowed"
                    name="discount"
                    value={formData.discount}
                  />
                </div>
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text">
                      Status <span className="text-red-600">*</span>
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full cursor-not-allowed"
                    name="status"
                    value={formData.status}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    {/* <option value="Cancelled">Cancelled</option> */}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text">
                      Payment Method <span className="text-red-600">*</span>
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full cursor-not-allowed"
                    name="paymentMethod"
                    value={formData.paymentMethod}
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
                      className="input input-bordered w-full cursor-not-allowed"
                      name="tax"
                      value={formData.tax}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mt-3">
                    <label className="label">
                      <span className="label-text">Note (If Needed)</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full h-12 cursor-not-allowed"
                      name="note"
                      value={formData.note}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
            {isLoading ? (
              <div className="mt-6">
                <Skeleton
                  variant="rectangular"
                  height={40}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="mt-6">
                <Link
                  to="/dashboard/sales"
                  className="btn bg-gray-200 text-gray-800 w-full"
                >
                  Back
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default SalesDetails;
