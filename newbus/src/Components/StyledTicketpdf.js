import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';

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

const StyledTicketPDF = ({ ticketGroup }) => {
  if (!ticketGroup) return null;

  const { 
    source, 
    destination, 
    date_of_travel, 
    bus_name, 
    bus_number, 
    departure, 
    arrival, 
    booking_id, 
    boarding_point, 
    seats, 
    price 
  } = ticketGroup;

  if (!date_of_travel || !bus_name || !bus_number || !departure || !arrival || !booking_id || !boarding_point || !seats || !price) {
    return null;
  }

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="/path/to/valid/logo.png" />
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>
        <Text style={styles.title}>{source} {'TO'} {destination}</Text>
        <Text style={styles.text}>Date: {date_of_travel.split('T')[0]}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bus Details</Text>
          <Text style={styles.text}>{bus_name} (Bus Number: {bus_number})</Text>
          <Text style={styles.text}>Reporting time: {departure}</Text>
          <Text style={styles.text}>Departure time: {departure}</Text>
          <Text style={styles.text}>Arrival time: {arrival}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boarding Point  (booking id:{booking_id})</Text>
          <Text style={styles.text}>{boarding_point}</Text>
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
            {seats.map((seat, index) => (
              <View style={styles.tableRow} key={index}>
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
          <Text style={styles.text}>Total Fare: ₹{price}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.note}>NOTE: This operator accepts mTicket; you need not carry a printout.</Text>
          <Text style={styles.note}>Total Fare includes service tax and service charge, if any.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default StyledTicketPDF;
