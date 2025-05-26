import React from "react";
import PropTypes from "prop-types";
import InvoiceHeader from "../cards/billing/InvoiceHeader";
import InvoiceItem from "../cards/billing/InvoiceItem";

const InvoicesSection = ({ invoices, generateInvoicePDF }) => {
  return (
    <section className="invoices">
      <InvoiceHeader />

      {invoices.length === 0 ? (
        <p className="no-invoices">No invoices found.</p>
      ) : (
        <div className="invoices-list">
          {invoices.map((invoice) => (
            <InvoiceItem
              key={invoice.id}
              date={invoice.date}
              invoiceNumber={invoice.invoiceNumber}
              amount={invoice.amount}
              currency={invoice.currency}
              onGeneratePDF={() => generateInvoicePDF(invoice)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

InvoicesSection.propTypes = {
  invoices: PropTypes.array.isRequired,
  generateInvoicePDF: PropTypes.func.isRequired,
};

export default InvoicesSection;
