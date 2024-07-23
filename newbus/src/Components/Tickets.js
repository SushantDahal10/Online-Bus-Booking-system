import React, { useState, useEffect } from 'react';
import { Page, Text, View, Image, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import '../CSS/Ticket.css';
import Footer from './Footer';
import Navbar from './Navbar';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2px solid #000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 30,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
    paddingBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#555',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderCollapse: 'collapse',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableCell: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  footer: {
    borderTop: '2px solid #000',
    paddingTop: 10,
    marginTop: 15,
  },
  note: {
    fontSize: 10,
    color: 'grey',
    textAlign: 'center',
  },
});

const StyledTicketPDF = ({ ticketGroup }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src="/path/to/logo.png" />
        <Text>Date: {new Date().toLocaleDateString()}</Text>
      </View>
      <Text style={styles.title}>{ticketGroup.source} ➔ {ticketGroup.destination}</Text>
      <Text style={styles.text}>Date: {ticketGroup.date_of_travel}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bus Details</Text>
        <Text style={styles.text}>{ticketGroup.bus_name} (Bus Number: {ticketGroup.bus_number})</Text>
        <Text style={styles.text}>Reporting time: {ticketGroup.departure}</Text>
        <Text style={styles.text}>Departure time: {ticketGroup.departure}</Text>
        <Text style={styles.text}>Arrival time: {ticketGroup.arrival}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Boarding Point  (booking id:{ticketGroup.booking_id})</Text>
        <Text style={styles.text}>{ticketGroup.boarding_point}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Passenger Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Seat No</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Name</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Age</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Gender</Text>
            </View>
          </View>
          {ticketGroup.seats.map((seat) => (
            <View style={styles.tableRow} key={seat.booking_id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{seat.seat_no}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{seat.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{seat.age}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{seat.gender}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fare</Text>
        <Text style={styles.text}>Total Fare: ₹{ticketGroup.price}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.note}>NOTE: This operator accepts mTicket; you need not carry a printout.</Text>
        <Text style={styles.note}>Total Fare includes service tax and service charge, if any.</Text>
      </View>
    </Page>
  </Document>
);

export default function Tickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch('http://localhost:8000/gettickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (response.ok) {
        const json = await response.json();
        setTickets(json);
      }
    };
    fetchTickets();
  }, []);

  const groupTickets = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const key = `${ticket.travel_id}-${ticket.bus_number}`;
      if (!acc[key]) {
        acc[key] = { ...ticket, seats: [], price: ticket.fare };
      } else {
        acc[key].price += ticket.fare;
      }
      acc[key].seats.push(ticket);
      return acc;
    }, {});
  };

  const groupedTickets = groupTickets(tickets);

  return (
    <>
      <Navbar />
      <div className="tickets-container">
        <h1 className="tickets-header">Your Bus Tickets</h1>
        {Object.keys(groupedTickets).map(key => {
          const ticketGroup = groupedTickets[key];
          return (
            <div className="ticket-item" key={key}>
              <div className="ticket-header">
                <h2>{ticketGroup.bus_name} (Bus Number: {ticketGroup.bus_number})</h2>
                <p><strong>From:</strong> {ticketGroup.source}</p>
                <p><strong>To:</strong> {ticketGroup.destination}</p>
              </div>
              <div className="ticket-info">
                <p><strong>Date:</strong> {ticketGroup.date_of_travel}</p>
                <p><strong>Departure:</strong> {ticketGroup.departure}</p>
                <p><strong>Arrival:</strong> {ticketGroup.arrival}</p>
              </div>
              <div className="ticket-details">
                <h3>Passenger Details</h3>
                <table className="ticket-table">
                  <thead>
                    <tr>
                      <th>Seat No</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketGroup.seats.map(seat => (
                      <tr key={seat.booking_id}>
                        <td>{seat.seat_no}</td>
                        <td>{seat.name}</td>
                        <td>{seat.age}</td>
                        <td>{seat.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ticket-price">
                <p><strong>Fare:</strong> ₹{ticketGroup.price}</p>
              </div>
              <div className="pdf-download-link">
                <PDFDownloadLink document={<StyledTicketPDF ticketGroup={ticketGroup} />} fileName={`ticket-${key}.pdf`}>
                  {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                </PDFDownloadLink>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </>
  );
}
