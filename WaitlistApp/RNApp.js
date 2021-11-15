import React, { Component } from 'react'
import { TouchableHighlight, View, Text, TextInput, StyleSheet } from 'react-native'

import { graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag'

export default class RNApp extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      phone: '',
    }
    //this.updateName = this.updateName.bind(this)
    //this.updatePhone = this.updatePhone.bind(this)
  }
  /*
  updateName(name) {
    this.setState({
      name
    })
  }
  updatePhone(phone) {
    this.setState({
      phone
    })
  }
  */

  render () {
    const query = gql`mutation customerAdd($customer: CustomerInputs!) { 
      customerAdd(customer: $customer) {
        id name phone time
      }
    }`

    const Customer = ({ data }) => (
      <View style={{paddingLeft: 20, paddingTop: 20}}>
        <Text>ID: {data.customer.id}</Text>
        <Text>Name: {data.customer.name}</Text>
        <Text>Phone: {data.customer.phone}</Text>
        <Text>Time: {data.customer.time}</Text>
      </View>
    )
    
    const ViewWithData = graphql(query, {
      options: { variables: { customer: {name: this.state.name, phone: this.state.phone }} }
    })(Customer)

    return (
      <Text style={{textAlign: 'center', fontSize:25}}>California Hotel</Text>
      <View style={styles.container}>
      <Mutation mutation={query}>
        {(addQuery)=>
          (
          )
        <Text style={{textAlign: 'center'}}>Add a new customer</Text>
        <TextInput
          onChangeText={(text)=>this.setState({name:text})}
          value={this.state.name}
          style={styles.input} 
          placeholder="Name"/>
        <TextInput
          onChangeText={(text)=>this.setState({phone:text})} 
          value={this.state.phone}
          style={styles.input} placeholder="Phone number"/>
        <Button
          title="Submit"
          onPress={() => {
            addQuery({
              variables: { customer: { name: this.state.name, phone: this.state.phone } },
          })
            .then((res)=>res)
            .catch((err) => <text>{err}</text>)
          this.setState({name:'',phone:''})
            }}
        />
        </Mutation>
        <ViewWithData />
      </View>
    )
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#dddddd',
    height: 50,
    margin: 20,
    marginBottom: 0,
    paddingLeft: 10
  }
})