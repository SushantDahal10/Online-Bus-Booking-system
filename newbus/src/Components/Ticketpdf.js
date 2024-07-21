import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import Footer from './Footer';
import Navbar from './Navbar';
import '../CSS/Ticket.css';

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    marginBottom: 5,
  },
  text: {
    marginBottom: 5,
    fontSize: 12,
  },
  price: {
    fontSize: 14,
    marginTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const TicketPDF = ({ tickets }) => {
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
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>Your Bus Tickets</Text>
        {Object.keys(groupedTickets).map((key) => {
          const ticketGroup = groupedTickets[key];
          return (
            <View key={key} style={styles.section}>
              <Text style={styles.header}>{ticketGroup.bus_name} (Bus Number: {ticketGroup.bus_number})</Text>
              <Text style={styles.text}><strong>From:</strong> {ticketGroup.source}</Text>
              <Text style={styles.text}><strong>To:</strong> {ticketGroup.destination}</Text>
              <Text style={styles.text}><strong>Date:</strong> {ticketGroup.date_of_travel}</Text>
              <Text style={styles.text}><strong>Departure:</strong> {ticketGroup.departure}</Text>
              <Text style={styles.text}><strong>Arrival:</strong> {ticketGroup.arrival}</Text>
              {ticketGroup.seats.map((seat) => (
                <View key={seat.booking_id}>
                  <Text style={styles.text}><strong>Seat Number:</strong> {seat.seat_no}</Text>
                  <Text style={styles.text}><strong>Passenger Name:</strong> {seat.name}</Text>
                  <Text style={styles.text}><strong>Age:</strong> {seat.age}</Text>
                  <Text style={styles.text}><strong>Gender:</strong> {seat.gender}</Text>
                </View>
              ))}
              <Text style={styles.price}><strong>Fare:</strong> ₹{ticketGroup.price}</Text>
              <Text style={styles.text}><strong>Duration:</strong> {ticketGroup.duration}</Text>
            </View>
          );
        })}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </Page>
    </Document>
  );
};

const Tickets = () => {
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

  return (
    <>
      <Navbar />
      <div className="tickets-container">
        <div className="tickets-header">Your Bus Tickets</div>
        {tickets.length > 0 && (
          <PDFDownloadLink 
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
            document={<TicketPDF tickets={tickets} />} 
            fileName="tickets.pdf"
          >
            {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
          </PDFDownloadLink>
        )}
      </div>
      <Footer />
    </>
  );
};  

export default Tickets;
