/* eslint-disable no-shadow */
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
  DeviceEventEmitter,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import {Client} from 'app-api';
import {Images} from 'app-assets';
import IconI from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Feather';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {tronLog} from 'app-common';
import Accordion from 'react-native-collapsible/Accordion';
import {connect} from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {Assignment, ProgressCircle, RenderDataHTML} from 'app-component';
import styles from './styles';
import {showLoading} from '../../actions/common';
import CountDown from '../../component/common/countdown';
import ReviewQuiz from '../../component/item-detail/review-quiz';
import { RenderDataAll, H5PContent } from '../../component/common/render-data-all';

class Learning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMenu: false,
      pageActive: 0,
      data: null,
      activeSections: [],
      isLesson: false,
      isQuiz: false,
      isStartQuiz: false,
      dataQuiz: null,
      itemQuestion: null,
      isAssignment: false,
      isShowReview: false,
    };
    this.item = null;
    this.id = null;
    this.type = null;
    this.idCourse = null;
    this.itemCheck = [];

    this.eventListener = null;
    this.backHandler = null;
  }

  async componentDidMount() {
    const {route} = this.props;
    const {item, index, idCourse} = route.params;
    await this.getLesson(item);
    this.item = item;
    this.idCourse = idCourse;
    this.setState({
      activeSections: [index],
    });

    // this.setState({ question: questionTemp });
    this.eventListener = DeviceEventEmitter.addListener(
      'reloadDataRetake',
      this.onReloadDataRetake,
    );
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );
  }

  reloadFinish = async () => {
    await this.setState({
      isShowMenu: false,
      pageActive: 0,
      data: null,
      activeSections: [],
      isLesson: false,
      isQuiz: false,
      isStartQuiz: false,
      dataQuiz: null,
      itemQuestion: null,
      isAssignment: false,
    });
    const response = await Client.quiz(this.item.id);
    this.setState({
      data: response,
      isLesson: false,
      isAssignment: false,
      isQuiz: true,
      dataQuiz: {
        ...response?.results,
        questions: response?.questions || {},
      },
    });
  };

  get dataLesson() {
    const {course} = this.props;
    let dataTemp = [];
    course.data.sections.forEach(obj => {
      dataTemp = [...dataTemp, ...obj.items];
    });
    return dataTemp;
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
    if (this.eventListener) {
      this.eventListener.remove();
    }
  }

  handleBackPress = () => {
    const {navigation} = this.props;
    navigation.goBack(null);
    return true;
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onReloadDataRetake = async data => {
    tronLog('data1111', data);
    await this.setState({isStartQuiz: false});
    await this.getLesson(this.item);
    this.setState({
      isStartQuiz: true,
      dataQuiz: data.results,
      itemQuestion: data.results.questions[0],
    });
    // this.onStartQuiz();
  };

  getLesson = async item => {
    const {dispatch} = this.props;
    // if (this.id === item.id) return;
    dispatch(showLoading(true));
    if (item.type === 'lp_lesson') {
      const response = await Client.lessonWithId(item.id);
      this.setState({
        data: response,
        isLesson: true,
        isQuiz: false,
        isAssignment: false,
      });
    }
    if (item.type === 'lp_quiz') {
      const response = await Client.quiz(item.id);
      tronLog('response123123123', response);
      this.setState({
        data: response,
        isLesson: false,
        isAssignment: false,
        isQuiz: true,
        isStartQuiz: response?.results?.status === 'started',
        dataQuiz: {
          ...response?.results,
          questions: response?.questions || {},
        },
        itemQuestion: response?.questions[0],
        pageActive: 0,
      });
    }
    if (item.type === 'lp_assignment') {
      this.setState({
        isAssignment: true,
        isLesson: false,
        isQuiz: false,
      });
    }
    this.id = item.id;
    dispatch(showLoading(false));
  };

  openMenu = () => {
    this.setState({isShowMenu: true});
  };

  selectQuestion(item) {
    const {itemQuestion} = this.state;

    if (itemQuestion.type === 'single_choice') {
      itemQuestion.answer = [item];
      this.forceUpdate();
    }
    if (itemQuestion.type === 'true_or_false') {
      itemQuestion.answer = item;
      this.forceUpdate();
    }
    if (itemQuestion.type === 'multi_choice') {
      if (itemQuestion?.answer) {
        const temp = itemQuestion?.answer.find(x => x.value === item.value);
        if (temp) {
          itemQuestion.answer = itemQuestion.answer.filter(
            x => x.value !== item.value,
          );
          this.forceUpdate();
        } else {
          itemQuestion.answer = [...itemQuestion.answer, item];
          this.forceUpdate();
        }
      } else {
        itemQuestion.answer = [item];
        this.forceUpdate();
      }
    }
  }

  onCompleteLesson = async () => {
    const {t, dispatch} = this.props;
    const param = {
      id: this.id,
    };

    await dispatch(showLoading(true));

    const response = await Client.completeLesson(param);

    if (response.status === 'success') {
      Alert.alert(t('learningScreen.lesson.alert.title'), response.message, [
        {
          text: t('learningScreen.lesson.alert.ok'),
          onPress: () => {
            this.onNext();
            DeviceEventEmitter.emit('loadCourseDetail');
            DeviceEventEmitter.emit('loadMyCourse');
          },
        },
      ]);
    } else {
      Alert.alert(response.message);
    }

    dispatch(showLoading(false));
  };

  renderHeaderSession = (section, index, isActive) => {
    return (
      <View key={String(index)}>
        <View style={[styles.subTitle, {marginTop: 8, marginBottom: 11}]}>
          <View style={styles.subTitle}>
            <IconI name={isActive ? 'caret-up' : 'caret-down'} size={15} />
            <Text numberOfLines={1} style={styles.txtSubTitle}>
              {section.title}
            </Text>
          </View>
          <Text style={styles.txtLength}>{section.items.length}</Text>
        </View>
      </View>
    );
  };

  async onNavigateLearning(item) {
    this.setState({isShowMenu: false});
    this.item = item;
    await this.getLesson(item);

    this.scrollView.scrollTo({y: 0, animated: true});
  }

  renderContent = section => {
    const {course} = this.props;

    const {items} = section;
    return (
      <View>
        {items.map((item, i) => (
          <TouchableOpacity
            key={String(i)}
            onPress={() => this.onNavigateLearning(item)}
            style={[styles.subTitle, {marginBottom: 5, marginLeft: 24}]}
            disabled={item.locked ? true : false}>
            <View style={styles.subTitle}>
              {item.type === 'lp_lesson' && (
                <IconF name="book" color="#4E4E4E" size={14} />
              )}
              {item.type === 'lp_quiz' && (
                <IconF name="help-circle" color="#4E4E4E" size={14} />
              )}
              {item.type === 'lp_assignment' && (
                <IconF name="file" color="#4E4E4E" size={14} />
              )}
              <Text
                numberOfLines={1}
                style={[
                  styles.txtItemLession,
                  this.item.id === item.id && {
                    color: '#000',
                    fontWeight: '500',
                  },
                ]}>
                {item.title}
              </Text>
            </View>
            {['completed', 'evaluated'].includes(item.status) ? (
              <IconI name="ios-checkmark-circle" style={styles.iconPreview} />
            ) : item.status === 'failed' ? (
              <IconI name="ios-close-circle" color="#FF0000" size={16} />
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {item.preview && (
                  <IconI name="eye-outline" style={styles.iconPreview} />
                )}
                {item.locked && (
                  <IconI name="lock-closed" color="#4E4E4E" size={16} />
                )}
                {item.duration !== '' && (
                  <Text style={styles.totalHours}>{item.duration}</Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  renderHeaderItem = ({item, index}) => {
    const {pageActive} = this.state;
    // if (index > 5 && pageActive < 5)
    //   return <Text style={{ marginLeft: 3, marginTop: 3 }}>...</Text>;
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            pageActive: index,
            itemQuestion: item,
          })
        }
        style={[
          styles.btnPage,
          {
            backgroundColor: pageActive === index ? '#FBC815' : '#fff',
            borderColor: pageActive === index ? '#FBC815' : '#E4E4E4',
          },
        ]}>
        <Text style={styles.txtPage}>{index + 1}</Text>
      </TouchableOpacity>
    );
  };

  onNext = async () => {
    const index = this.dataLesson.findIndex(x => x.id === this.id);
    if (index === this.dataLesson.length - 1) {
      tronLog('this.dataLesson', this.dataLesson[this.dataLesson.length - 1]);
      this.onNavigateLearning(this.dataLesson[this.dataLesson.length - 1]);
      return;
    }

    this.onNavigateLearning(this.dataLesson[index + 1]);
  };

  onStartQuiz = async () => {
    const {dispatch, t} = this.props;
    const {dataQuiz} = this.state;

    dispatch(showLoading(true));

    const param = {
      id: this.id,
    };

    // Check if question is empty
    if (dataQuiz?.questions?.length === 0) {
      Alert.alert('', t('learningScreen.quiz.noQuestion'));
      dispatch(showLoading(false));
      return;
    }

    const response = await Client.quizStart(param);
    if (response?.status === 'success') {
      this.itemCheck = [];
      this.setState({
        isStartQuiz: true,
        dataQuiz: {
          ...response.results,
          instant_check: this.state.dataQuiz?.instant_check || false,
          checked_questions: [],
        },
        itemQuestion: response.results.questions[0],
      });
    } else {
      Alert.alert(response?.message);
    }
    dispatch(showLoading(false));
  };

  onPrevQuiz = () => {
    const {pageActive, dataQuiz} = this.state;
    this.flatListRef.scrollToIndex({
      index: pageActive - 1,
      animated: true,
    });
    this.setState({
      itemQuestion: dataQuiz.questions[pageActive - 1],
      pageActive: pageActive - 1,
    });
  };

  onNextQuiz = () => {
    const {t} = this.props;
    const {pageActive, dataQuiz} = this.state;
    if (dataQuiz.questions.length === pageActive + 1) {
      Alert.alert('', t('learningScreen.quiz.nextQuestion'));
      return;
    }
    this.flatListRef.scrollToIndex({
      index: pageActive + 1,
      animated: true,
    });
    this.setState({
      itemQuestion: dataQuiz.questions[pageActive + 1],
      pageActive: pageActive + 1,
    });
  };

  onFinish = async () => {
    const {dispatch, route} = this.props;
    const {dataQuiz} = this.state;
    dispatch(showLoading(true));
    const itemTemp = new Object();
    tronLog('dataQuiz.questions', dataQuiz.questions);
    dataQuiz.questions.forEach(x => {
      if (this.itemCheck.find(y => y.id === x.id)) {
        return;
      }
      if (x.type === 'sorting_choice') {
        itemTemp[String(x.id)] = x.options.map(y => y.value);
      } else if (x?.answer) {
        if (x.type === 'true_or_false') {
          itemTemp[String(x.id)] = x.answer.value;
        } else if (x.type === 'fill_in_blanks') {
          itemTemp[String(x.id)] = x.answer;
        } else if (x.type === 'multi_choice') {
          itemTemp[String(x.id)] = x.answer.map(y => y.value);
        } else {
          itemTemp[String(x.id)] = x.answer.map(y => y.value);
        }
      }
    });
    const param = {
      id: this.item?.id || route.params?.item?.id || 0,
      answered: itemTemp,
    };

    const response = await Client.quizFinish(param);
    if (response?.status === 'success') {
      // navigation.navigate('FinishLearningScreen', {
      //   data: response.results,
      //   dataQuiz,
      //   retake_count: this.state.data?.meta_data?._lp_retake_count,
      //   idQuiz: this.state.data?.id,
      // });
      await this.reloadFinish();
    }
    dispatch(showLoading(false));
  };

  onFinishCourse = async () => {
    const {t} = this.props;
    Alert.alert(
      t('learningScreen.finishCourseAlert.title'),
      t('learningScreen.finishCourseAlert.description'),
      [
        {
          text: t('learningScreen.finishCourseAlert.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('learningScreen.finishCourseAlert.ok'),
          onPress: async () => {
            const {dispatch, navigation} = this.props;
            dispatch(showLoading(true));
            const param = {
              id: this.idCourse,
            };

            const response = await Client.finishCourse(param);
            tronLog('finishcourse', response);
            dispatch(showLoading(false));
            if (response.status === 'success') {
              Alert.alert(response.message);
              DeviceEventEmitter.emit('loadCourseDetail');
              DeviceEventEmitter.emit('loadMyCourse');
              navigation.goBack();
            } else {
              Alert.alert(response.message);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  showHint = () => {
    const {t} = this.props;
    const {itemQuestion} = this.state;
    tronLog('itemQuestion', itemQuestion);
    if (itemQuestion?.hint) {
      Alert.alert(t('learningScreen.quiz.hint'), itemQuestion.hint);
    } else {
      Alert.alert(t('learningScreen.quiz.hintEmpty'));
    }
  };

  renderFillInBlanks = () => {
    const {itemQuestion, dataQuiz} = this.state;
    const lstIdKeys = [];
    const {ids, title_api} = itemQuestion.options[0];
    ids.forEach(id => {
      lstIdKeys.push({id, key: `{{FIB_${id}}}`});
    });
    const item = itemQuestion.options[0];

    const words = title_api.split(' ');
    return words.map((i, k) => {
      const itemKey = lstIdKeys.find(x => x.key === i);
      if (itemKey) {
        if (
          this.itemCheck.find(x => x.id === itemQuestion.id) ||
          (dataQuiz?.checked_questions &&
            dataQuiz?.checked_questions.includes(itemQuestion.id))
        ) {
          return (
            <View
              key={String(k)}
              style={{
                minWidth: 60,
                paddingVertical: 2,
                paddingHorizontal: 5,
                backgroundColor: '#ECECEC',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              {!item.answers[itemKey.id]?.is_correct && (
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#000000',
                  }}>
                  {item.answers[itemKey.id]?.answer || ''}
                </Text>
              )}
              {!item.answers[itemKey.id]?.is_correct &&
                item.answers[itemKey.id]?.correct && (
                  <IconF name="arrow-right" color="#666" size={14} />
                )}
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#36CE61',
                }}>
                {item.answers[itemKey.id]?.correct
                  ? `${item.answers[itemKey.id]?.correct}`
                  : ''}
              </Text>
            </View>
          );
        }
        return (
          <TextInput
            key={String(k)}
            disabled={!!this.itemCheck.find(x => x.id === itemQuestion.id)}
            style={{
              marginVertical: 0,
              paddingVertical: 0,
              marginBottom: 5,
              // height: 20,
              minWidth: 60,
              borderBottomWidth: 1,
              color: '#000',
            }}
            underlineColorAndroid="undefined"
            onChangeText={value => this.onChangeFillBlank(itemKey.id, value)}
          />
        );
      }
      return <Text key={String(k)}> {i} </Text>;
    });
  };

  onChangeFillBlank = (id, value) => {
    const {itemQuestion} = this.state;
    if (itemQuestion.answer !== undefined) {
      if (itemQuestion?.answer[id] === value) {
        itemQuestion.answer[id] = value;
      } else {
        itemQuestion.answer[id] = value;
      }
    } else {
      itemQuestion.answer = new Object();
      itemQuestion.answer[id] = value;
    }
  };

  callBackFinishQuiz = () => {
    this.onFinish();
  };

  onCheck = async () => {
    const {t, dispatch} = this.props;
    const {itemQuestion} = this.state;

    if (!itemQuestion?.answer && itemQuestion.type !== 'sorting_choice') {
      Alert.alert('', t('learningScreen.quiz.checkAlert'));
      return;
    }

    // dispatch(showLoading(true));
    const itemTemp = new Object();

    if (itemQuestion.type === 'sorting_choice') {
      itemTemp.value = itemQuestion.options.map(y => y.value);
    } else if (itemQuestion?.answer) {
      if (itemQuestion.type === 'true_or_false') {
        itemTemp.value = itemQuestion.answer.value;
      } else if (itemQuestion.type === 'fill_in_blanks') {
        itemTemp.value = itemQuestion.answer;
      } else if (itemQuestion.type === 'multi_choice') {
        itemTemp.value = itemQuestion.answer.map(y => y.value);
      } else {
        itemTemp.value = itemQuestion.answer.map(y => y.value);
      }
    }
    const param = {
      id: this.item.id,
      question_id: itemQuestion.id,
      answered: itemTemp.value,
    };

    const response = await Client.checkAnswer(param);
    if (response.code === 'cannot_check_answer') {
      Alert.alert(response.message);
    }
    const dataTemp = {
      id: itemQuestion.id,
      result: response.result,
      explanation: response?.explanation || null,
    };
    if (response?.options) {
      const newItemQuestion = {...itemQuestion};
      newItemQuestion.options = response.options;
      this.setState({itemQuestion: newItemQuestion});
    }
    this.itemCheck.push(dataTemp);
    this.forceUpdate();
    // this.dispatch(showLoading(false));
  };

  isDisable = (itemCheck, itemQuestion) => {
    const {dataQuiz} = this.state;

    if (
      itemCheck.find(x => x.id === itemQuestion.id) ||
      (dataQuiz?.checked_questions &&
        dataQuiz.checked_questions.includes(itemQuestion.id))
    ) {
      return true;
    }
    return false;
  };

  render() {
    const {t, course, navigation} = this.props;

    const {
      isShowMenu,
      data,
      activeSections,
      isLesson,
      isQuiz,
      isStartQuiz,
      dataQuiz,
      itemQuestion,
      pageActive,
      isAssignment,
    } = this.state;

    return (
      <View style={styles.container}>
        <Image source={Images.bannerMyCourse} style={styles.imgBanner} />
        <View style={styles.header}>
          <View style={styles.header1}>
            <TouchableOpacity
              onPress={this.openMenu}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Image source={Images.iconMenu} style={styles.iconMenu} />
            </TouchableOpacity>
            <Text style={styles.childTitle} />
            <TouchableOpacity
              onPress={this.goBack}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Image source={Images.iconClose} style={styles.iconBack} />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            ref={refs => {
              this.scrollView = refs;
            }}
            scrollEnabled={this.state.scrollenabled}
            style={styles.content}
            contentContainerStyle={{paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            overScrollMode="never"
            removeClippedSubviews>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {isLesson && (
                <View style={{flex: 1}}>
                  {data?.duration !== '' && data?.duration > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 6,
                      }}>
                      <IconF name="clock" size={22} />
                      <Text style={styles.txtTime}>{data?.duration}</Text>
                    </View>
                  )}

                  <Text style={styles.txtName}>{data?.name}</Text>
                  <RenderDataHTML html={data?.video_intro || ''} />
                  <RenderDataHTML html={data?.content || ''} />
                  {/* <RenderDataAll  /> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    {course.data?.course_data.status === 'enrolled' && (
                      <>
                        {course?.data?.sections[0]?.items.find(
                          x => x.id === data.id,
                        )?.status !== 'completed' && (
                          <TouchableOpacity
                            style={styles.btnFinish}
                            onPress={this.onCompleteLesson}>
                            <Text style={styles.txtFinish}>
                              {t('learningScreen.lesson.btnComplete')}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}

                    {data?.can_finish_course && (
                      <TouchableOpacity
                        style={styles.btnFinishCourse}
                        onPress={this.onFinishCourse}>
                        <Text style={styles.txtFinish}>
                          {t('learningScreen.finishCourse')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {isQuiz && !isStartQuiz && data?.results?.status === '' && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <IconF name="clock" size={14} />
                    <Text style={[styles.txtTime, {marginLeft: 4}]}>
                      {data?.duration}
                    </Text>
                  </View>

                  <Text style={[styles.title, {marginVertical: 10}]}>
                    {data?.name}
                  </Text>
                  <Text style={styles.txtLession}>
                    {t('learningScreen.quiz.questionCount', {
                      count: data?.questions.length,
                    })}
                  </Text>
                  <Text style={styles.txtLession}>
                    {t('learningScreen.quiz.passingGrade', {
                      grade: data?.meta_data._lp_passing_grade,
                    })}
                  </Text>
                  <RenderDataHTML html={data?.content || ''} />
                  <TouchableOpacity
                    style={[styles.btnFinish, {marginTop: 10}]}
                    onPress={this.onStartQuiz}>
                    <Text style={styles.txtFinish}>
                      {t('learningScreen.quiz.btnStart')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {isQuiz && !isStartQuiz && data?.results?.status !== '' && (
                <View>
                  <View>
                    <View style={styles.overview}>
                      <ProgressCircle
                        widthX={110}
                        progress={
                          Math.round(data?.results?.results?.result) / 100
                        }
                        strokeWidth={10}
                        backgroundColor="#F6F6F6"
                        progressColor={
                          data?.results?.results?.graduation === 'failed'
                            ? '#F46647'
                            : '#58C3FF'
                        }
                        textStyle={styles.txtCircle}
                      />
                      <View style={{marginLeft: 24}}>
                        <Text style={styles.txtLable}>
                          {t('learningScreen.quiz.result.title')}
                        </Text>
                        <Text
                          style={[
                            styles.txtResult,
                            data?.results.results?.graduation !== 'failed' && {
                              color: '#58C3FF',
                            },
                          ]}>
                          {data?.results?.results?.graduationText}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{marginTop: 25}}>
                    {data?.results?.results?.graduation === 'failed' && (
                      <Text style={styles.txt3}>
                        {t('learningScreen.quiz.result.failed', {
                          result: Math.round(data?.results?.results?.result),
                          grade: data?.results.results?.passing_grade,
                        })}
                      </Text>
                    )}

                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        {t('learningScreen.quiz.result.questions')}
                      </Text>
                      <Text style={styles.txt2}>
                        {data?.results.results?.question_count}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        {t('learningScreen.quiz.result.correct')}
                      </Text>
                      <Text style={styles.txt2}>
                        {data?.results.results?.question_correct}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        {t('learningScreen.quiz.result.wrong')}
                      </Text>
                      <Text style={styles.txt2}>
                        {data?.results.results?.question_wrong}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        {t('learningScreen.quiz.result.skipped')}
                      </Text>
                      <Text style={styles.txt2}>
                        {data?.results.results?.question_empty}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        {t('learningScreen.quiz.result.points')}
                      </Text>
                      <Text style={styles.txt2}>
                        {data?.results.results?.user_mark}
                      </Text>
                    </View>
                    <View style={styles.viewQuestion1}>
                      <Text style={styles.txt2}>
                        {t('learningScreen.quiz.result.timespent')}
                      </Text>
                      <Text style={styles.txt2}>
                        {data?.results.results?.time_spend}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.viewBottom}>
                    {(data?.results?.retake_count == -1 ||
                      data?.results?.retake_count - data.results.retaken >
                        0) && (
                      <TouchableOpacity
                        style={styles.btnRetoke}
                        onPress={() => this.onStartQuiz()}>
                        <Text style={styles.txtRetoke}>
                          {t('learningScreen.quiz.result.btnRetake', {
                            count:
                              data?.results?.retake_count == -1
                                ? t(
                                    'learningScreen.quiz.result.btnRetakeUnlimited',
                                  )
                                : data?.results?.retake_count -
                                  data.results.retaken,
                          })}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.btnReview}
                      onPress={() => {
                        this.setState({isShowReview: true});
                      }}>
                      <Text style={styles.txtReview}>
                        {t('learningScreen.quiz.result.btnReview')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            {isAssignment && (
              <Assignment
                id={this.id}
                navigation={navigation}
                onFinishCourse={this.onFinishCourse}
              />
            )}
            {isStartQuiz && isQuiz && (
              <View style={{marginTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[styles.title, {flex: 1, paddingRight: 10}]}>
                    {data?.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <CountDown
                      duration={dataQuiz?.total_time}
                      callBack={this.callBackFinishQuiz}
                      textStyle={{
                        color: 'red',
                        fontSize: 12,
                        fontFamily: 'Poppins-Medium',
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        color: 'red',
                        fontFamily: 'Poppins',
                        fontSize: 12,
                      }}>
                      {' '}
                      {t('learningScreen.quiz.timeRemaining')}
                    </Text>
                  </View>
                </View>
                {dataQuiz.questions.length > 1 && (
                  <View style={styles.viewPage}>
                    <TouchableOpacity
                      style={styles.btnPage}
                      onPress={this.onPrevQuiz}
                      disabled={pageActive === 0 ? true : false}>
                      <IconI name="chevron-back-outline" />
                    </TouchableOpacity>
                    <FlatList
                      ref={ref => {
                        this.flatListRef = ref;
                      }}
                      data={dataQuiz.questions}
                      horizontal
                      style={styles.flatPage}
                      contentContainerStyle={styles.flatPageContainer}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => String(index)}
                      renderItem={({item, index}) =>
                        this.renderHeaderItem({item, index})
                      }
                    />
                    <TouchableOpacity
                      style={styles.btnPage}
                      onPress={this.onNextQuiz}>
                      <IconI name="chevron-forward-outline" />
                    </TouchableOpacity>
                  </View>
                )}
                {/* phần câu hỏi */}
                {itemQuestion && (
                  <View style={styles.viewQuestion}>
                    <RenderDataHTML
                      html={itemQuestion?.title}
                      style={styles.txtTitleQuestion}
                    />
                    {itemQuestion?.content && (
                      <RenderDataHTML html={itemQuestion?.content} />
                    )}
                    {itemQuestion.type === 'single_choice' &&
                      itemQuestion.options.map((item, i) => (
                        <TouchableOpacity
                          key={String(i)}
                          style={styles.itemQuestion}
                          onPress={() => this.selectQuestion(item)}
                          disabled={this.isDisable(
                            this.itemCheck,
                            itemQuestion,
                          )}>
                          <IconI
                            name={
                              itemQuestion?.answer &&
                              itemQuestion.answer.find(
                                x => x.value === item.value,
                              )
                                ? 'radio-button-on'
                                : 'radio-button-off'
                            }
                            size={14}
                            color="#878787"
                          />
                          <Text style={styles.txtItemQuestion}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    {itemQuestion.type === 'true_or_false' &&
                      itemQuestion.options.map((item, i) => (
                        <TouchableOpacity
                          key={String(i)}
                          style={styles.itemQuestion}
                          onPress={() => this.selectQuestion(item)}
                          disabled={this.isDisable(
                            this.itemCheck,
                            itemQuestion,
                          )}>
                          <IconI
                            name={
                              itemQuestion?.answer &&
                              itemQuestion.answer.value === item.value
                                ? 'radio-button-on'
                                : 'radio-button-off'
                            }
                            size={14}
                            color="#878787"
                          />
                          <Text style={styles.txtItemQuestion}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      ))}

                    {itemQuestion.type === 'multi_choice' &&
                      itemQuestion.options.map((item, i) => (
                        <TouchableOpacity
                          key={String(i)}
                          style={styles.itemQuestion}
                          disabled={this.isDisable(
                            this.itemCheck,
                            itemQuestion,
                          )}
                          onPress={() => this.selectQuestion(item)}>
                          <IconI
                            name={
                              itemQuestion?.answer &&
                              itemQuestion.answer.find(
                                x => x.value === item.value,
                              )
                                ? 'ios-checkbox-outline'
                                : 'square-outline'
                            }
                            size={14}
                            color="#878787"
                          />
                          <Text style={styles.txtItemQuestion}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    {itemQuestion.type === 'sorting_choice' && (
                      <DraggableFlatList
                        onDragBegin={() => {
                          this.setState({scrollenabled: false});
                        }}
                        onRelease={() => {
                          this.setState({scrollenabled: true});
                        }}
                        onDragEnd={({data}) => {
                          itemQuestion.options = data;
                          this.forceUpdate();
                        }}
                        keyExtractor={item => `draggable-item-${item.value}`}
                        data={itemQuestion.options}
                        renderItem={({item, drag, isActive}) => (
                          <TouchableOpacity
                            style={{
                              padding: 8,
                              borderColor: '#F3F3F3',
                              borderWidth: 1,
                              borderRadius: 6,
                              alignItems: 'center',

                              // justifyContent: 'center',
                              flexDirection: 'row',
                              // marginHorizontal: 16,
                              marginBottom: 12,
                              backgroundColor: isActive ? '#F3F3F3' : '#fff',
                            }}
                            disabled={this.isDisable(
                              this.itemCheck,
                              itemQuestion,
                            )}
                            onLongPress={drag}>
                            <IconI
                              name="menu"
                              size={22}
                              color="#000"
                              style={{marginRight: 10}}
                            />
                            <Text style={styles.txtItemQuestion}>
                              {item.title}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                    {itemQuestion.type === 'fill_in_blanks' && (
                      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {this.renderFillInBlanks()}
                      </View>
                    )}
                  </View>
                )}
                {this.itemCheck.find(x => x.id === itemQuestion.id) && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 30,
                    }}>
                    {this.itemCheck.find(x => x.id === itemQuestion.id)?.result
                      ?.correct ? (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          backgroundColor: '#58C3FF',
                          alignSelf: 'flex-start',
                          borderRadius: 4,
                        }}>
                        <Text style={{color: '#fff'}}>
                          {t('learningScreen.quiz.correct')}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 6,
                          backgroundColor: '#F46647',
                          alignSelf: 'flex-start',
                          borderRadius: 4,
                        }}>
                        <Text style={{color: '#fff'}}>
                          {t('learningScreen.quiz.inCorrect')}
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        marginLeft: 16,
                        padding: 8,
                        alignSelf: 'flex-start',
                      }}>
                      <Text>
                        {t('learningScreen.quiz.point', {
                          point: this.itemCheck.find(
                            x => x.id === itemQuestion.id,
                          )?.result?.mark,
                        })}
                      </Text>
                    </View>
                    {this.itemCheck.find(x => x.id === itemQuestion.id)
                      ?.explanation && (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 16,
                          padding: 0,
                          alignSelf: 'flex-start',
                          borderBottomWidth: 2,
                          borderBottomColor: '#b334af',
                        }}
                        onPress={() =>
                          Alert.alert(
                            'Explanation',
                            this.itemCheck.find(x => x.id === itemQuestion.id)
                              .explanation,
                          )
                        }>
                        <IconF name="navigation" color="#b334af" size={14} />
                        <Text
                          style={{
                            color: '#b334af',
                            marginLeft: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          {t('learningScreen.quiz.explanation')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <View style={{height: 36}} />
                {dataQuiz?.instant_check &&
                  (!dataQuiz?.checked_questions.length ||
                    !dataQuiz?.checked_questions.includes(itemQuestion.id)) && (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#36CE61',
                        borderRadius: 6,
                        justifyContent: 'center',
                        height: 50,
                      }}
                      disabled={
                        !!this.itemCheck.find(x => x.id === itemQuestion.id)
                      }
                      onPress={() => this.onCheck()}>
                      <Text style={{color: '#fff'}}>
                        {t('learningScreen.quiz.btnCheck')}
                      </Text>
                      <IconI name="checkmark" color="#fff" />
                    </TouchableOpacity>
                  )}

                {dataQuiz?.instant_check &&
                  dataQuiz?.checked_questions &&
                  dataQuiz?.checked_questions.includes(itemQuestion.id) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                      }}>
                      <Text style={{color: '#36CE61'}}>
                        {t('learningScreen.quiz.questionAnswered')}
                      </Text>
                      <IconI name="checkmark" color="#36CE61" />
                    </View>
                  )}
                <View style={styles.viewBtnBottom}>
                  <TouchableOpacity
                    style={styles.btnHint}
                    onPress={this.showHint}>
                    <IconM name="lightbulb-on-outline" size={20} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnSubmit}
                    onPress={this.onFinish}>
                    <Text style={styles.txtBtnSubmit}>
                      {t('learningScreen.quiz.btnFinish')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnNext}
                    onPress={this.onNextQuiz}>
                    <Image source={Images.iconNext} style={styles.iconNext} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {data?.can_finish_course && isQuiz && (
              <View
                style={{
                  paddingBottom: 30,
                  paddingHorizontal: 30,
                  backgroundColor: '#fff',
                  marginTop: 30,
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#222',
                    borderRadius: 6,
                    paddingHorizontal: 21,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onFinishCourse}>
                  <Text style={styles.txtFinish}>
                    {t('learningScreen.finishCourse')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal
          isVisible={isShowMenu}
          backdropOpacity={0.3}
          // deviceWidth={width}
          // deviceHeight={height}
          style={styles.modal}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          useNativeDriver
          coverScreen
          onBackButtonPress={() => {
            this.setState({isShowMenu: false});
          }}
          onBackdropPress={() => {
            this.setState({isShowMenu: false});
          }}>
          <View style={styles.viewModalMenu}>
            <View style={styles.viewHeaderModalMenu}>
              <Text
                style={[styles.title, {flex: 1, marginRight: 10}]}
                numberOfLines={1}>
                {course?.data?.name || ''}
              </Text>
              <TouchableOpacity
                style={styles.btnCloseMenu}
                onPress={() => {
                  this.setState({isShowMenu: false});
                }}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Image source={Images.iconClose} style={styles.iconBack} />
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}>
              <View style={styles.contentMenu}>
                {course?.data?.sections && (
                  <Accordion
                    sections={course?.data?.sections}
                    underlayColor="transpation"
                    activeSections={activeSections}
                    renderHeader={this.renderHeaderSession}
                    renderContent={this.renderContent}
                    onChange={value => {
                      this.setState({activeSections: value});
                    }}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
        {this.state.isShowReview && data && (
          <ReviewQuiz
            data={data}
            isShowReview={this.state.isShowReview}
            onClose={() => this.setState({isShowReview: false})}
          />
        )}
      </View>
    );
  }
}
const mapStateToProps = ({course}) => ({
  course,
});
const mapDispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Learning));
