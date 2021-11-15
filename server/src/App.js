import React from "react";
import "./mystyle.css";

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

function CustomerRow(props) {
    const customer = props.customer;
    return (
        <tr>
          <td>{customer.id}</td>
          <td>{customer.name}</td>
          <td>{customer.phone}</td>
          <td>{customer.time.toLocaleString()}</td>
        </tr>
    );
}

function DisplayCustomers(props) {
    const cusRows = props.customers.slice(0,25).map(customer =>
        <CustomerRow key={customer.id} customer={customer} />
    );

    return (
        <div className="showContent" id="showContent">
            <h3>Show customers</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone number</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {cusRows}
                </tbody>
            </table>
        </div>
    );
}

class Header extends React.Component {
    render() {
        return (
            <header className="header">
                <div className="brand">HOTEL CAL.</div>
            </header>
        );
    }
}

class Footer extends React.Component {
    render() {
        return (
            <footer className="footer">
                <p>HOTEL CALIFORNIA ALL RIGHTS RESERVED.</p>
            </footer>
        );
    }
}

function DisplayFreeSlots(props) {
    const cusNum = props.customers.length;
    var currentSlots = 0;
    if (cusNum < 25) {
        currentSlots = 25 - cusNum;
    }
    else {
        currentSlots = 0;
    }
    const inner = "Current free slots:" + currentSlots;
    return (
        <div className="showSlots">
            <h2 id="freeSlots">{inner}</h2>
        </div>
    );
}

class AddCustomer extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.addCustomer;
        if (!form.name.value || !form.phone.value) {
            alert("Do not enter a null value!");
            return false;
        }
        else {
            const customer = {
                name: form.name.value, phone: form.phone.value, 
            }
            this.props.createCustomer(customer);
            form.name.value = ""; form.phone.value = "";
        }
    }

    render() {
        return (
            <form className="addContent" name="addCustomer" onSubmit={this.handleSubmit}>
                <h3>Add a new customer</h3>
                <label htmlFor="addName">Name:</label>
                <input type="text" id="addName" name="name" placeholder="Name"/>
                <label htmlFor="addPhone">Phone number:</label>
                <input type="text" id="addPhone" name="phone" placeholder="Phone"/>
                <button className="fbtn">Add</button>
            </form>
        );
    }
}

class DeleteCustomer extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.delCustomer;
        if (!form.name.value || !form.phone.value) {
            alert("Do not enter a null value!");
            return false;
        }
        else {
            const customer = {
                name: form.name.value, phone: form.phone.value, 
            }
            this.props.deleteCustomer(customer);
            form.name.value = ""; form.phone.value = "";
        }
    }

    render() {
        return (
            <form className="delContent" name="delCustomer" onSubmit={this.handleSubmit}>
                <h3>Delete a customer</h3>
                <label htmlFor="delName">Name:</label>
                <input type="text" id="delName" name="name" placeholder="Name"/>
                <label htmlFor="delPhone">Phone number:</label>
                <input type="text" id="delPhone" name="phone" placeholder="Phone"/>
                <button className="fbtn">Delete</button>
            </form>
        );
    }
}

class DisplayHomepage extends React.Component {
    constructor() {
        super();
        this.state = { customers: [] };
        this.createCustomer = this.createCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            customerList {
              id name phone time
            }
          }`;
      
        const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query })
        });
        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver);
        this.setState({ customers: result.data.customerList });
    }

    async createCustomer(customer) {
        const query = `mutation customerAdd($customer: CustomerInputs!) {
            customerAdd(customer: $customer) {
              id
            }
        }`;
        alert('Submit succeed!');
      
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query, variables: { customer } })
        });
        this.loadData();
    }

    async deleteCustomer(customer) {
        const query = `mutation customerDel($customer: CustomerInputs!) {
            customerDel(customer: $customer) {
            id
            }
        }`;
        
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query, variables: { customer } })
        });
        this.loadData();
    }

    render() {
        return (
            <React.Fragment>
                <div id="container">
                    <Header />
                    <h1>WAITLIST SYSTEM</h1>
                    <DisplayFreeSlots customers={this.state.customers}/>
                    <hr />
                    <AddCustomer createCustomer={this.createCustomer}/>
                    <hr />
                    <DeleteCustomer deleteCustomer={this.deleteCustomer}/>
                    <hr />
                    <DisplayCustomers customers={this.state.customers}/>
                    <Footer />
                </div>
            </React.Fragment>
        );
    }
}

const App = () => {
    return (
        <DisplayHomepage/>
    );
};

export default App;