import { useState } from "react";
import { UseFundStore } from "../store/UseFundStore";

function AddFunds() {
    const { isLoading, addFund } = UseFundStore();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    await addFund(amount);
  };

  return (
    <div id="addFund" className="max-w-2xl mx-auto text-black">
      <header>
        <h1 className="text-4xl font-bold">Add Funds</h1>
        <p className="text-gray-600 mt-2">
          Top up your TaskFund account to stay on track with your goals.
        </p>
      </header>

      <div className="bg-white rounded-xl shadow p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-sm font-medium mb-2"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-lg text-gray-400">
                $
              </span>
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-600 focus:border-blue-600 text-lg"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["card", "bank", "wallet"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === method
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-center capitalize">
                    {method === "card"
                      ? "Credit Card"
                      : method === "bank"
                      ? "Bank Transfer"
                      : "Digital Wallet"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {paymentMethod === "card" && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="card-number"
                  className="block text-sm font-medium mb-2"
                >
                  Card Number
                </label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="•••• •••• •••• ••••"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="expiry-date"
                    className="block text-sm font-medium mb-2"
                  >
                    Expiry Date
                  </label>
                  <input
                    id="expiry-date"
                    type="text"
                    placeholder="MM / YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium mb-2"
                  >
                    CVV
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-300"
            >
                { isLoading ? 'Adding' : 'Add Funds Securely' }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFunds;
