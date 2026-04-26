import React from 'react';
import AdminReportSummaryCardItem from './AdminReportSummaryCardItem';

const AdminReportSummaryCards = ({ cards }) => {
  return (
    <section className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <AdminReportSummaryCardItem key={card.id} card={card} />
      ))}
    </section>
  );
};

export default AdminReportSummaryCards;
