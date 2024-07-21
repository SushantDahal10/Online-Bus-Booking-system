  import React, { useState, useEffect } from 'react';
  import { Page, Text, View,Image, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
  import '../CSS/Ticket.css';
  import Footer from './Footer';
  import Navbar from './Navbar';

    
    const styles = StyleSheet.create({
      page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica',
      },
      header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1px solid #000',
        paddingBottom: 10,
        marginBottom: 10,
      },
      title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
      },
      section: {
        marginBottom: 10,
      },
      sectionTitle: {
        fontSize: 12,
        marginBottom: 5,
        fontWeight: 'bold',
      },
      text: {
        marginBottom: 5,
      },
      table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        borderCollapse: 'collapse',
      },
      tableRow: {
        flexDirection: 'row',
      },
      tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
      },
      tableCell: {
        margin: 5,
        fontSize: 10,
      },
      footer: {
        borderTop: '1px solid #000',
        paddingTop: 10,
        marginTop: 10,
      },
      note: {
        fontSize: 8,
        color: 'grey',
      },
      logo: {
        width: 80,
        height: 20,
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
            <Text style={styles.sectionTitle}>Boarding Point</Text>
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
            <Text style={styles.note}>NOTE: This operator accepts mTicket, you need not carry a print out</Text>
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
          <div className="tickets-header">Your Bus Tickets</div>
          {Object.keys(groupedTickets).map(key => {
            const ticketGroup = groupedTickets[key];
            return (
              <div className="ticket-item" key={key}>
                <div className="ticket-header">
                  <div className="ticket-bus">
                    <h3>{ticketGroup.bus_name} (Bus Number: {ticketGroup.bus_number})</h3>
                    <p><strong>From:</strong> {ticketGroup.source}</p>
                    <p><strong>To:</strong> {ticketGroup.destination}</p>
                  </div>
                  <div className="ticket-date-time">
                    <p><strong>Date:</strong> {ticketGroup.date_of_travel}</p>
                    <p><strong>Departure:</strong> {ticketGroup.departure}</p>
                    <p><strong>Arrival:</strong> {ticketGroup.arrival}</p>
                  </div>
                </div>
                <div className="ticket-details">
                  {ticketGroup.seats.map(seat => (
                    <div key={seat.booking_id}>
                      <p><strong>Seat Number:</strong> {seat.seat_no}</p>
                      <p><strong>Passenger Name:</strong> {seat.name}</p>
                      <p><strong>Age:</strong> {seat.age}</p>
                      <p><strong>Gender:</strong> {seat.gender}</p>
                    </div>
                  ))}
                </div>
                <div className="ticket-price">
                  <p><strong>Fare:</strong> ₹{ticketGroup.price}</p>
                </div>
                <div className="ticket-footer">
                  <p><strong>Duration:</strong> {ticketGroup.duration}</p>
                </div>
                <PDFDownloadLink document={<StyledTicketPDF ticketGroup={ticketGroup} />} fileName={`ticket-${key}.pdf`}>
                  {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                </PDFDownloadLink>
              </div>
            );
          })}
        </div>
        <Footer />
      </>
    );
  }
