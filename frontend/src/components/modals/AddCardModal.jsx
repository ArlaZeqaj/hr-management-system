import React, { useEffect, useRef } from "react";

const AddCardModal = ({
  showModal,
  setShowModal,
  cardForm,
  setCardForm,
  handleSaveCard,
  message,
  messageType,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    } else {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <dialog ref={dialogRef} className="billing-modal">
      <div className="billing-modal-content">
        <div className="billing-modal-header">
          <h3>Add Payment Method</h3>
          <button
            className="billing-modal-close"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
        </div>

        {/* Card Preview */}
        <div className="billing-card-preview">
          <div className="billing-card-preview-header">
            <span className="billing-card-company">HRCloudX</span>
            <div className="billing-card-type-logo">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/lyn2slbm_expires_30_days.png"
                alt="Mastercard"
                width="40"
              />
            </div>
          </div>
          <div className="billing-card-number">
            {cardForm.number
              ? cardForm.number.replace(/(\d{4})/g, "$1 ").trim()
              : "•••• •••• •••• ••••"}
          </div>
          <div className="billing-card-footer">
            <div className="billing-card-detail">
              <span className="billing-detail-label">Expires</span>
              <span className="billing-detail-value">
                {cardForm.expiry || "••/••"}
              </span>
            </div>
            <div className="billing-card-detail">
              <span className="billing-detail-label">CVV</span>
              <span className="billing-detail-value">
                {cardForm.cvv ? "•••" : "•••"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveCard} className="billing-card-form">
          <div className="billing-form-group floating">
            <input
              type="text"
              id="cardNumber"
              placeholder=" "
              value={cardForm.number}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .substring(0, 16);
                setCardForm({ ...cardForm, number: value });
              }}
              maxLength="19"
              required
            />
            <label htmlFor="cardNumber">Card Number</label>
            <div className="billing-card-icons">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/4a0s3ehi_expires_30_days.png"
                alt="Visa"
                width="40"
              />
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/lyn2slbm_expires_30_days.png"
                alt="Mastercard"
                width="40"
              />
            </div>
          </div>

          <div className="billing-form-row">
            <div className="billing-form-group floating">
              <input
                type="text"
                id="expiry"
                placeholder="MM/YY"
                value={cardForm.expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");

                  // Auto-insert slash after 2 digits
                  if (value.length > 2) {
                    value = value.substring(0, 2) + "/" + value.substring(2, 4);
                  }

                  // Validate month (01-12)
                  if (value.length >= 2) {
                    const month = parseInt(value.substring(0, 2), 10);
                    if (month < 1 || month > 12) {
                      // Invalid month - don't update
                      return;
                    }
                  }

                  // Limit to MM/YY format (5 chars max)
                  setCardForm({
                    ...cardForm,
                    expiry: value.substring(0, 5),
                  });
                }}
                maxLength="5"
                pattern="(0[1-9]|1[0-2])\/\d{2}"
                required
              />
              <label htmlFor="expiry">Expiry Date</label>
            </div>

            <div className="billing-form-group floating">
              <div className="billing-input-with-icon">
                <input
                  type="password"
                  id="cvv"
                  placeholder=" "
                  value={cardForm.cvv}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .substring(0, 3);
                    setCardForm({ ...cardForm, cvv: value });
                  }}
                  maxLength="3"
                  required
                />
                <label htmlFor="cvv">Security Code</label>
                <button
                  type="button"
                  className="billing-info-icon"
                  aria-label="What is CVV?"
                  title="3-digit code on back of card"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div className={`billing-form-message ${messageType}`}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                {messageType === "success" ? (
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                ) : (
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  />
                )}
              </svg>
              <span>{message}</span>
            </div>
          )}

          <div className="billing-form-actions">
            <button
              type="button"
              className="billing-secondary-btn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="billing-primary-btn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Save Card
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddCardModal;