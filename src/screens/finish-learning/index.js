import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
  DeviceEventEmitter,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ProgressCircle } from 'app-component';
import { Client } from 'app-api';
import { Images } from 'app-assets';
import { tronLog } from 'app-common';
import { connect } from 'react-redux';
import styles from './styles';
import { showLoading } from '../../actions/common';
import ReviewQuiz from '../../component/item-detail/review-quiz';

class FinishLearning extends Component {
  retakeCount = 0;

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isReview: false,
      dataQuiz: null,
    };

    this.backHandler = null;
  }

  async componentDidMount() {
    const { route } = this.props;
    const { retake_count, idQuiz } = route.params;
    this.retakeCount = retake_count;
    this.id = idQuiz;
    tronLog('idQuiz', idQuiz);
    const response = await Client.quiz(this.id);
    this.setState({
      data: response,
    });
    // this.setState({ data, dataQuiz });

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  handleBackPress = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
    return true;
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  openMenu = () => {
    this.setState({ isShowMenu: true });
  };

  onRetake = async () => {
    const { dispatch, navigation } = this.props;

    dispatch(showLoading(true));
    const param = {
      id: this.id,
    };
    const response = await Client.quizStart(param);
    if (response?.success === true) {
      Alert.alert(response?.message);
      DeviceEventEmitter.emit('reloadDataRetake', response);
      navigation.goBack();
    } else {
      Alert.alert(response?.message);
    }
    dispatch(showLoading(false));
  };

  render() {
    const { data, isReview, dataQuiz } = this.state;

    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
        <View style={styles.header}>
          <View style={styles.header1}>
            <Text style={styles.childTitle} />
            <TouchableOpacity
              onPress={this.goBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image source={Images.iconClose} style={styles.iconBack} />
            </TouchableOpacity>
          </View>
        </View>
        {!isReview && (
          <ScrollView style={styles.content}>
            <View>
              {/* <Text style={styles.title}>Quiz 1: PHP - Enviroment Setup</Text> */}
              <View style={styles.overview}>
                <ProgressCircle
                  widthX={110}
                  progress={Math.round(data?.results?.result) / 100}
                  strokeWidth={10}
                  backgroundColor="#F6F6F6"
                  progressColor={
                    data?.results.results?.graduation === 'failed'
                      ? '#F46647'
                      : '#58C3FF'
                  }
                  textStyle={styles.txtCircle}
                />
                <View style={{ marginLeft: 24 }}>
                  <Text style={styles.txtLable}>Your Result</Text>
                  <Text
                    style={[
                      styles.txtResult,
                      data?.results.results?.graduation !== 'failed' && {
                        color: '#58C3FF',
                      },
                    ]}
                  >
                    {data?.results.results?.graduationText}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 25 }}>
              {data?.results.results?.graduation === 'failed' && (
                <Text style={styles.txt1}>
                  Your quiz grade failed. The result is{' '}
                  {Math.round(data?.results.results?.result)}% (the requirement
                  is the {data?.results.results?.passing_grade})
                </Text>
              )}

              <View style={styles.viewQuestion1}>
                <Text style={styles.txt2}>Questions</Text>
                <Text style={styles.txt2}>
                  {data?.results.results?.question_count}
                </Text>
              </View>
              <View style={styles.viewQuestion1}>
                <Text style={styles.txt2}>Correct</Text>
                <Text style={styles.txt2}>
                  {data?.results.results?.question_correct}
                </Text>
              </View>
              <View style={styles.viewQuestion1}>
                <Text style={styles.txt2}>Wrong</Text>
                <Text style={styles.txt2}>
                  {data?.results.results?.question_wrong}
                </Text>
              </View>
              <View style={styles.viewQuestion1}>
                <Text style={styles.txt2}>Skipped</Text>
                <Text style={styles.txt2}>
                  {data?.results.results?.question_empty}
                </Text>
              </View>
              <View style={styles.viewQuestion1}>
                <Text style={styles.txt2}>Points</Text>
                <Text style={styles.txt2}>
                  {data?.results.results?.user_mark}
                </Text>
              </View>
              <View style={styles.viewQuestion1}>
                <Text style={styles.txt2}>Time spend</Text>
                <Text style={styles.txt2}>
                  {data?.results.results?.time_spend}
                </Text>
              </View>
            </View>
            <View style={styles.viewBottom}>
              {data?.meta_data?._lp_retake_count - data?.results?.retaken >
                0 && (
                <View style={styles.viewBottom}>
                  <TouchableOpacity
                    style={styles.btnRetoke}
                    onPress={() => this.onRetake()}
                  >
                    <Text style={styles.txtRetoke}>
                      Retake (
                      {data?.meta_data?._lp_retake_count -
                        data?.results?.retaken}
                      )
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={styles.btnReview}
                onPress={() =>
                  this.setState({
                    isShowReview: true,
                  })
                }
              >
                <Text style={styles.txtReview}>Review</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        {this.state.isShowReview && (
          <ReviewQuiz
            data={data}
            isShowReview={this.state.isShowReview}
            onClose={() => this.setState({ isShowReview: false })}
          />
        )}
      </View>
    );
  }
}
const mapStateToProps = ({ course }) => ({
  course,
});
const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(FinishLearning);
