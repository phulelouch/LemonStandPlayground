import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  BackHandler,
  Linking,
  Keyboard,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import IconF from 'react-native-vector-icons/Feather';
import { SITE_URL } from 'app-config';
import { tronLog } from 'app-common';
import DocumentPicker from 'react-native-document-picker';
import { Client } from 'app-api';
import { RenderDataHTML } from 'app-component';
import styles from './styles/assignment';
import CountDown from '../common/countdown';
import { showLoading } from '../../actions/common';

export default function Assignment({ navigation, id, onFinishCourse }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [answerFiles, setAnswerFiles] = useState({});
  const [files, setFiles] = useState([]);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const GRADUATION = {
    passed: t('learningScreen.assignment.resultPassed'),
    failed: t('learningScreen.assignment.resultFailed'),
  };

  useEffect(() => {
    const subKWS = Keyboard.addListener('keyboardWillShow', () =>
      setIsScrollEnabled(false)
    );
    const subKDS = Keyboard.addListener('keyboardDidShow', () =>
      setIsScrollEnabled(false)
    );

    return () => {
      subKWS.remove();
      subKDS.remove();
    };
  }, []);

  useEffect(() => {
    async function getResponse() {
      dispatch(showLoading(true));
      await getDataResponse();
      dispatch(showLoading(false));
    }

    getResponse();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [id]);

  const getDataResponse = async () => {
    const response = await Client.getAssignment(id);

    if (!response?.code) {
      setData(response);
      setNote(response?.assignment_answer?.note || '');
      setStatus(response?.results?.status || '');
      setAnswerFiles(response?.assignment_answer?.file || {});
      setAttachments(response?.attachment || []);
    }
  };

  const onChooseFile = async () => {
    try {
      const documents = await DocumentPicker.pickMultiple({
        copyTo: 'documentDirectory',
        type: [
          DocumentPicker.types.allFiles,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.zip,
          DocumentPicker.types.images,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
          DocumentPicker.types.plainText,
        ],
      });
      tronLog('onChooseFile', documents);
      setFiles(documents);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const onSubmit = async (action = 'save') => {
    try {
      const param = new FormData();
      param.append('action', action);
      param.append('id', id);
      param.append('note', note);

      if (files.length > 0) {
        files.forEach((file) => {
          param.append('file[]', {
            uri: file.fileCopyUri,
            type: file.type,
            name: file.name,
            size: file.size,
          });
        });
      }

      dispatch(showLoading(true));

      const response = await Client.saveSendAssignment(param);

      if (response?.data?.status === 200) {
        await getDataResponse();
      }

      tronLog('assignmentOnSubmit', response);

      Alert.alert(t('learningScreen.assignment.title'), response?.message);
    } catch (error) {
      console.log('assignmentErrorOnSubmit', error);
    } finally {
      dispatch(showLoading(false));
    }
  };

  const onStart = async () => {
    dispatch(showLoading(true));
    const response = await Client.startAssignment({ id: data.id });

    if (response.data.status === 200) {
      await getDataResponse();
    } else {
      Alert.alert('', response.message);
    }

    dispatch(showLoading(false));
  };

  const onRetake = async () => {
    dispatch(showLoading(true));
    const response = await Client.retakeAssignment({ id: data.id });

    if (response.data.status === 200) {
      await getDataResponse();
    } else {
      Alert.alert('', response.message);
    }

    dispatch(showLoading(false));
  };

  const onDeleteFile = async (fileId) => {
    dispatch(showLoading(true));
    const response = await Client.deleteFileAssignment({
      fileId,
      id,
    });

    if (response.data.status === 200) {
      await getDataResponse();
    }

    dispatch(showLoading(false));

    Alert.alert('', response.message);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!status ? (
        <>
          <Text style={styles.title}>{data.name}</Text>
          <View style={styles.viewFlex}>
            <Text style={styles.lable}>
              {t('learningScreen.assignment.acceptAllowed')}
            </Text>
            <Text style={styles.txtItem}>
              {data.files_amount !== 0 ? data.files_amount : 'Unlimited'}
            </Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.lable}>
              {t('learningScreen.assignment.durations')}
            </Text>
            <Text style={styles.txtItem}>{data.duration.format}</Text>
          </View>
          <View style={styles.viewFlex}>
            <Text style={styles.lable}>
              {t('learningScreen.assignment.passingGrade')}
            </Text>
            <Text style={styles.txtItem}>
              {t('learningScreen.assignment.point', {
                point: data.passing_grade,
              })}
            </Text>
          </View>
          {data.introdution ? (
            <>
              <Text style={[styles.title, { marginTop: 20 }]}>
                {t('learningScreen.assignment.overview')}
              </Text>
              <Text style={styles.txtDescription}>{data.introdution}</Text>
            </>
          ) : null}

          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity style={styles.btn} onPress={onStart}>
              <Text style={styles.txtBtn}>
                {t('learningScreen.assignment.start')}
              </Text>
            </TouchableOpacity>

            {/* Finish course */}
            {data?.can_finish_course && (
              <TouchableOpacity
                style={styles.btnFinishCourse}
                onPress={onFinishCourse}
              >
                <Text style={styles.txtFinishCourse}>
                  {t('learningScreen.finishCourse')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <View>
          {['completed', 'evaluated'].includes(status) ? (
            <>
              {/* Assignment title */}
              <Text style={styles.title}>{data.name}</Text>

              {/* Your result */}
              {Object.keys(data?.evaluation).length > 0 ? (
                <View style={styles.viewFlex}>
                  <Text style={styles.lable}>
                    {t('learningScreen.assignment.yourResult')}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins-Medium',
                        fontSize: 14,
                        color: '#000',
                      }}
                    >
                      {`${data.evaluation?.user_mark || 0}/${
                        data.evaluation?.mark || 0
                      }`}
                    </Text>

                    <View
                      style={{
                        alignItems: 'center',
                        marginLeft: 5,
                        backgroundColor:
                          data.evaluation?.graduation === 'passed'
                            ? '#58C3FF'
                            : '#F46647',
                        borderRadius: 4,
                        paddingHorizontal: 5,
                        paddingVertical: 3,
                      }}
                    >
                      {data.evaluation?.graduation ? (
                        <Text style={{ color: '#fff', fontSize: 12 }}>
                          {GRADUATION[data.evaluation.graduation]}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              ) : null}

              {/* Attachment */}
              <View style={styles.viewFlex}>
                <Text style={styles.lable}>
                  {t('learningScreen.assignment.attachments')}
                </Text>
                <View>
                  {data.attachment.length
                    ? data.attachment.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(item?.url || '')}
                          key={item?.id || index}
                        >
                          <Text style={styles.txtItem} key={item.id || index}>
                            <IconF name="link" color="#94a3b8" size={12} />{' '}
                            {item.id
                              ? item.name
                              : t(
                                  'learningScreen.assignment.missingAttachment'
                                )}
                          </Text>
                        </TouchableOpacity>
                      ))
                    : t('learningScreen.assignment.missingAttachments')}
                </View>
              </View>

              {/* Your answer note */}
              {data.assignment_answer?.note ? (
                <View style={{ marginBottom: 8 }}>
                  <Text style={styles.lable}>
                    {t('learningScreen.assignment.yourAnswer')}
                  </Text>
                  <Text style={{ ...styles.txtItem, marginTop: 10 }}>
                    {data.assignment_answer.note}
                  </Text>
                </View>
              ) : null}

              {/* Your uploaded files */}
              {data.assignment_answer?.file ? (
                <View style={{ marginBottom: 8 }}>
                  <Text style={styles.lable}>
                    {t('learningScreen.assignment.yourUploadedFiles')}
                  </Text>
                  <View style={{ ...styles.txtItem, marginTop: 8 }}>
                    {Object.entries(data.assignment_answer.file).map(
                      (entry) => (
                        <View
                          key={entry[0]}
                          style={{
                            flexDirection: 'row',
                            paddingBottom: 5,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(SITE_URL + entry[1].url)
                            }
                          >
                            <Text
                              style={{
                                fontFamily: 'Poppins',
                                color: '#5C5C5C',
                              }}
                            >
                              <IconF name="link" color="#94a3b8" size={12} />{' '}
                              {entry[1].filename}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )
                    )}
                  </View>
                </View>
              ) : null}

              {/* Instructor's message */}
              {data.evaluation?.instructor_note ? (
                <View style={{ marginBottom: 8 }}>
                  <Text style={styles.lable}>
                    {t('learningScreen.assignment.instructorMessage')}
                  </Text>
                  <Text style={{ ...styles.txtItem, marginTop: 8 }}>
                    {data.evaluation?.instructor_note}
                  </Text>
                </View>
              ) : null}

              {/* References */}
              {data.evaluation?.reference_files?.length > 0 ? (
                <View style={{ marginBottom: 8 }}>
                  <Text style={styles.lable}>
                    {t('learningScreen.assignment.references')}
                  </Text>
                  <View style={{ ...styles.txtItem, marginTop: 8 }}>
                    {data.evaluation.reference_files.map((referenceFile) => (
                      <View key={referenceFile.id} style={{ marginBottom: 4 }}>
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(referenceFile?.url || '')
                          }
                        >
                          <Text
                            style={{
                              fontFamily: 'Poppins',
                              color: '#5C5C5C',
                              fontSize: 14,
                            }}
                          >
                            <IconF name="link" color="#94a3b8" size={12} />{' '}
                            {referenceFile.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Retake */}
                {data.retake_count > data.retaken && (
                  <TouchableOpacity style={styles.btnRetake} onPress={onRetake}>
                    <Text style={styles.txtRetake}>
                      {t('learningScreen.assignment.btnRetake', {
                        count: data.retake_count - data.retaken,
                      })}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Finish course */}
                {data?.can_finish_course && (
                  <TouchableOpacity
                    style={styles.btnFinishCourse}
                    onPress={onFinishCourse}
                  >
                    <Text style={styles.txtFinishCourse}>
                      {t('learningScreen.finishCourse')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <View>
              {/* Assignment duration */}
              {['started', 'doing', 'completed'].includes(status) ? (
                <View style={styles.viewDuration}>
                  <CountDown
                    duration={data?.duration?.time_remaining || 0}
                    textStyle={styles.txtCountDown}
                    callBack={() => onSubmit('send')}
                  />
                  <Text style={styles.txtDuration}>
                    {t('learningScreen.assignment.timeRemaining')}
                  </Text>
                </View>
              ) : null}

              {/* Assignment content */}
              <RenderDataHTML html={data?.content || ''} />

              {/* Attachment */}
              <View style={{ ...styles.viewFlex, marginBottom: 10 }}>
                <Text style={styles.lable}>
                  {t('learningScreen.assignment.attachments')}
                </Text>
                <Text style={styles.txtItem}>
                  {attachments.length
                    ? attachments.map((item, index) => (
                        <Text
                          key={item.id || index}
                          onPress={() =>
                            item?.url ? Linking.openURL(item.url) : null
                          }
                        >
                          <IconF name="link" color="#94a3b8" size={12} />{' '}
                          {item.id
                            ? item.name
                            : t('learningScreen.assignment.missingAttachment')}
                        </Text>
                      ))
                    : t('learningScreen.assignment.missingAttachments')}
                </Text>
              </View>

              {/* Your answer note */}
              <View>
                <Text style={styles.lable}>
                  {t('learningScreen.assignment.answer')}
                </Text>
                <TextInput
                  value={note}
                  style={styles.inputSearch}
                  scrollEnabled={isScrollEnabled}
                  multiline
                  autoCorrect={false}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  onChangeText={(value) => setNote(value)}
                />
              </View>

              {/* Your answer files */}
              <View style={styles.viewChooseFile}>
                <TouchableOpacity
                  onPress={onChooseFile}
                  style={styles.btnChoose}
                >
                  <Text style={styles.txtChoose}>
                    {t('learningScreen.assignment.chooseFile')}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 8,
                  }}
                >
                  {files.length > 0 ? (
                    files.map((file, index) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}
                        key={file?.id || index}
                      >
                        <TouchableOpacity>
                          <IconF
                            name="x"
                            color="#dc2626"
                            size={14}
                            onPress={() => {
                              const newFiles = [...files];
                              newFiles.splice(index, 1);
                              setFiles(newFiles);
                            }}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontFamily: 'Poppins',
                            fontSize: 12,
                            marginLeft: 5,
                            color: '#334155',
                          }}
                          key={file?.id || index}
                        >
                          {file.name ||
                            t('learningScreen.assignment.missingAttachment')}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.txtFileSelect}>
                      {t('learningScreen.assignment.nofile')}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.txt3}>
                {t('learningScreen.assignment.chooseFileDescription', {
                  files_amount: data?.files_amount,
                  allow_file_type: data?.allow_file_type,
                })}
              </Text>

              {Object.keys(answerFiles).length > 0 ? (
                <View style={{ ...styles.txtItem, marginTop: 10 }}>
                  {Object.entries(answerFiles).map((entry) => (
                    <View
                      key={entry[0]}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 5,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          marginRight: 5,
                          borderWidth: 1,
                          borderColor: '#cbd5e1',
                          borderRadius: 5,
                          height: 24,
                          width: 24,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#e2e8f0',
                        }}
                        onPress={() => {
                          Alert.alert(
                            t('learningScreen.assignment.deleteFileTitle'),
                            t('learningScreen.assignment.deleteFileMessage'),
                            [
                              {
                                text: t('learningScreen.assignment.cancel'),
                                onPress: () => {},
                                style: 'cancel',
                              },
                              {
                                text: t('learningScreen.assignment.ok'),
                                onPress: () => onDeleteFile(entry[0]),
                              },
                            ],
                            { cancelable: false }
                          );
                        }}
                      >
                        <IconF name="trash" color="#dc2626" size={12} />
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: 'Poppins',
                          color: '#334155',
                          fontSize: 13,
                          flex: 1,
                        }}
                        numberOfLines={1}
                      >
                        {entry[1].filename}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* Submit */}
              {['started', 'doing'].includes(status) ? (
                <View style={styles.viewBtn}>
                  <TouchableOpacity
                    style={styles.btnSend}
                    onPress={() => onSubmit('save')}
                  >
                    <Text style={styles.txtBtnSend}>
                      {t('learningScreen.assignment.save')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnSend}
                    onPress={() => onSubmit('send')}
                  >
                    <Text style={styles.txtBtnSend}>
                      {t('learningScreen.assignment.send')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Finish course */}
              {data?.can_finish_course && (
                <View style={{ marginTop: 20 }}>
                  <TouchableOpacity
                    style={styles.btnFinishCourse}
                    onPress={onFinishCourse}
                  >
                    <Text style={styles.txtFinishCourse}>
                      {t('learningScreen.finishCourse')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
