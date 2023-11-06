import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import IconF from 'react-native-vector-icons/Feather';
import IconI from 'react-native-vector-icons/Ionicons';
import {RenderDataHTML} from 'app-component';
import {tronLog} from 'app-common';
import Modal from 'react-native-modal';
import {withTranslation} from 'react-i18next';
import {t} from 'i18next';
import styles from './styles/review-quiz';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class ReviewQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageActive: 0,
      itemQuestion: props?.data?.questions[0] ?? null,
      data: props?.data ?? null,
      dataQuiz: props?.data ?? null,
      isVisible: false,
    };
  }

  selectQuestion(item) {
    const {itemQuestion} = this.state;

    if (
      itemQuestion.type === 'single_choice' ||
      itemQuestion.type === 'true_or_false'
    ) {
      itemQuestion.answer = [item];
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
    const {pageActive, dataQuiz} = this.state;
    this.flatListRef.scrollToIndex({
      index: pageActive + 1,
      animated: true,
    });
    this.setState({
      itemQuestion: dataQuiz.questions[pageActive + 1],
      pageActive: pageActive + 1,
    });
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

  itemOption = (item, i) => {
    const {data, itemQuestion} = this.state;
    const userAnswer = data.results.answered[itemQuestion.id].answered;

    return (
      <TouchableOpacity key={String(i)} style={styles.itemQuestion}>
        {data.results.answered[itemQuestion.id]?.correct &&
        userAnswer.includes(item.value) ? (
          <IconI name="checkmark-circle-outline" size={14} color="#36CE61" />
        ) : item?.is_true === 'yes' ? (
          <IconI name="checkmark-circle-outline" size={14} color="#36CE61" />
        ) : userAnswer.includes(item.value) ? (
          <IconI name="close-circle-sharp" size={14} color="#FF4444" />
        ) : (
          <IconI name="ellipse-outline" size={14} color="#878787" />
        )}
        <Text style={styles.txtItemQuestion}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  itemOptionMultiChoice = (item, i) => {
    const {data, itemQuestion} = this.state;
    const userAnswer = data.results.answered[itemQuestion.id].answered;
    return (
      <TouchableOpacity key={String(i)} style={styles.itemQuestion} disabled>
        {data.results.answered[itemQuestion.id]?.correct &&
        userAnswer.includes(item.value) ? (
          <IconI name="checkmark-circle-outline" size={14} color="#36CE61" />
        ) : item?.is_true === 'yes' ? (
          <IconI
            name="checkmark-circle-outline"
            size={14}
            color={userAnswer.includes(item.value) ? '#36CE61' : '#FF4444'}
          />
        ) : (
          <IconI
            name="square-outline"
            size={14}
            color={userAnswer.includes(item.value) ? '#FF4444' : '#878787'}
          />
        )}
        <Text style={styles.txtItemQuestion}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  renderFillInBlanks = item => {
    const lstIdKeys = [];
    const {itemQuestion, data} = this.state;
    const {ids, title_api} = item;
    ids.forEach(id => {
      lstIdKeys.push({id, key: `{{FIB_${id}}}`});
    });

    const userAnswer = data.results.answered[itemQuestion.id].answered;

    const words = title_api.split(' ');
    return words.map((i, k) => {
      const itemKey = lstIdKeys.find(x => x.key === i);
      if (itemKey) {
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
                {userAnswer[itemKey.id]}
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
      return <Text key={String(k)}> {i} </Text>;
    });
  };

  renderItemSortChoice = itemParam => {
    const {t} = this.props;
    const {itemQuestion, data} = this.state;
    tronLog('item1111', itemQuestion, itemParam);
    const userAnswer = data.results.answered[itemQuestion.id].answered;

    const dataSort = itemParam.options.sort((a, b) => a.sorting - b.sorting);
    return (
      <FlatList
        keyExtractor={item => `draggable-item-${item.value}`}
        data={userAnswer}
        renderItem={({item, index}) => (
          <View style={{marginBottom: 10}}>
            <TouchableOpacity
              disabled
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
                backgroundColor: '#fff',
              }}>
              <IconI
                name="menu"
                size={22}
                color="#000"
                style={{marginRight: 10}}
              />
              <Text style={styles.txtItemQuestion}>
                {itemParam.options.find(x => x.value === item).title}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                padding: 8,
                borderColor: '#6CDA45',
                borderWidth: 1,
                borderRadius: 6,
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text style={styles.txtItemQuestion}>
                {dataSort[index].title}
              </Text>
            </View>
          </View>
        )}
      />
    );
  };

  render() {
    const {pageActive, data, itemQuestion, dataQuiz} = this.state;
    const {isShowReview} = this.props;
    // Check if question is empty
    if (!itemQuestion) {
      return null;
    }
    const userAnswer = data.results.answered[itemQuestion.id];
    const question = data.questions.find(x => x.id === itemQuestion.id);
    return (
      <Modal
        isVisible={isShowReview}
        style={{
          margin: 0,
          zIndex: 10000,
          width: deviceWidth,
          height: deviceHeight,
          backgroundColor: '#fff',
        }}>
        <View>
          <TouchableOpacity
            hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
            style={{marginTop: 40, marginLeft: 10}}
            onPress={() => this.props.onClose()}>
            <IconI name="close" color="#000" size={28} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <ScrollView style={styles.content}>
            <Text style={styles.title}>{dataQuiz.name}</Text>
            {data.questions.length > 1 && (
              <>
                <View style={styles.viewPage}>
                  <TouchableOpacity
                    style={styles.btnPage}
                    onPress={this.onPrevQuiz}
                    disabled={pageActive === 0}>
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
                    disabled={dataQuiz.questions.length === pageActive + 1}
                    onPress={this.onNextQuiz}>
                    <IconI name="chevron-forward-outline" />
                  </TouchableOpacity>
                </View>
              </>
            )}
            {itemQuestion && (
              <View style={styles.viewQuestion}>
                <RenderDataHTML
                  html={itemQuestion?.title}
                  style={styles.txtTitleQuestion}
                />

                <RenderDataHTML html={itemQuestion?.content} />

                {(itemQuestion.type === 'true_or_false' ||
                  itemQuestion.type === 'single_choice') &&
                  itemQuestion.options.map((item, i) =>
                    this.itemOption(item, i),
                  )}

                {itemQuestion.type === 'multi_choice' &&
                  itemQuestion.options.map((item, i) =>
                    this.itemOptionMultiChoice(item, i),
                  )}
                {itemQuestion.type === 'fill_in_blanks' && (
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {itemQuestion.options.map((item, i) =>
                      this.renderFillInBlanks(item, i),
                    )}
                  </View>
                )}

                {itemQuestion.type === 'sorting_choice' &&
                  this.renderItemSortChoice(itemQuestion)}
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 30,
              }}>
              {userAnswer?.correct ? (
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
              <Text style={{marginLeft: 16}}>
                {t('learningScreen.quiz.point', {
                  point: `${userAnswer?.mark} / ${question.point}`,
                  interpolation: {escapeValue: false},
                })}
              </Text>
              {userAnswer?.explanation ? (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 16,
                    alignSelf: 'flex-start',
                    borderBottomWidth: 2,
                    borderBottomColor: '#b334af',
                  }}
                  onPress={() =>
                    Alert.alert(
                      t('learningScreen.quiz.explanation'),
                      userAnswer.explanation,
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
              ) : null}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

export default withTranslation()(ReviewQuiz);
