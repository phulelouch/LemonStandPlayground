import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { Images } from 'app-assets';
import styles from './styles/upcoming-course-horizontal';
import IconI from "react-native-vector-icons/Ionicons";
export default class UpcomingCourseHorizontal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00"
    }
  }

  componentDidMount() {
    let x = setInterval(() => {

      // Get today's date and time
      let now = new Date().getTime();
      // alert(startTime)
      // Find the distance between now and the count down date
      let distance = this.props.StartTime.getTime() - now;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);


      // Display the result in the element with id="demo"
      this.setState({
        days, hours, minutes, seconds
      })

      // If the count down is finished, write some text
      if (distance < 0) {
        this.setState({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00"
        })
        clearInterval(x);
      }
    }, 1000);
  }

  timer(startTime) {
    let x = setInterval(() => {

      // Get today's date and time
      let now = new Date().getTime();
      // alert(startTime)
      // Find the distance between now and the count down date
      let distance = startTime.getTime() - now;

      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      this.setState({
        days, hours, minutes, seconds
      })

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        this.setState({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00"
        })
      }
    }, 1000);
  }

  onNavigateDetail = () => {
    // const { productId, onPress } = this.props;
    // onPress(productId);
  };

  render() {
    const {
      item
    } = this.props;

    const { days, hours, minutes, seconds } = this.state;

    return (
      <TouchableOpacity
        onPress={this.onNavigateDetail}
        style={styles.container}
      >
        <View>
          <Image source={{ uri: item.Image }} style={styles.image} />
          <View style={{
            width: 220,
            position: 'absolute',
            flexDirection: 'row',
            paddingHorizontal: 15,
            bottom: 15,
            alignItems: 'center',
          }}>
            <View style={styles.viewTime}>
              <Text style={styles.price}>{days}</Text>
            </View>
            <View style={styles.viewTime}>
              <Text style={styles.price}>{hours}</Text>
            </View>
            <View style={styles.viewTime}>
              <Text style={styles.price}>{minutes}</Text>
            </View>
            <View style={styles.viewTime}>
              <Text style={styles.price}>{seconds}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.title}>{item.Title}</Text>
        <Text style={styles.content}>{item.Content}</Text>
      </TouchableOpacity>
    );
  }
}
