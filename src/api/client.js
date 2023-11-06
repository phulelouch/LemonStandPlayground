import {config} from './config';

const Client = {
  login: params => config.post('/wp-json/learnpress/v1/token', params),

  register: params =>
    config.post('/wp-json/learnpress/v1/token/register', params),

  course: (params = {}, randomVersion = true) =>
    config.get('/wp-json/learnpress/v1/courses', {...params}, randomVersion),

  courseDetail: id => config.get(`/wp-json/learnpress/v1/courses/${id}`),

  lessonWithId: id => config.get(`/wp-json/learnpress/v1/lessons/${id}`),

  lesson: params => config.get('/wp-json/learnpress/v1/lessons', {...params}),

  finishCourse: params =>
    config.post('/wp-json/learnpress/v1/courses/finish', params),

  retakeCourse: params =>
    config.post('/wp-json/learnpress/v1/courses/retake', params),

  enroll: params =>
    config.post('/wp-json/learnpress/v1/courses/enroll', params),

  completeLesson: params =>
    config.post('/wp-json/learnpress/v1/lessons/finish', params),

  quiz: id => config.get(`/wp-json/learnpress/v1/quiz/${id}`),

  quizStart: params => config.post('/wp-json/learnpress/v1/quiz/start', params),

  quizFinish: params =>
    config.post('/wp-json/learnpress/v1/quiz/finish', params),

  quizRetake: params =>
    config.post('/wp-json/learnpress/v1/quiz/retake', params),

  allUser: params => config.get('/wp-json/learnpress/v1/users', {...params}),

  getUser: id => config.get(`/wp-json/learnpress/v1/users/${id}`),

  updateUser: (id, params) =>
    config.multipartPost(`/wp-json/learnpress/v1/users/${id}`, params),

  getOverview: id =>
    config.get(`/wp-json/learnpress/v1/courses/${id}`, {
      optimize:
        'intructor,meta_data,on_sale,count_students,can_finish,can_retake,ratake_count,rataken,duration,tags,categories,rating,price,origin_price,sale_price',
    }),

  getCategory: params =>
    config.get('/wp-json/wp/v2/course_category', {...params}),

  addRemoveWishlist: params =>
    config.post('/wp-json/learnpress/v1/wishlist/toggle', params),

  getWishlist: params =>
    config.get('/wp-json/learnpress/v1/wishlist', {...params}),

  getWishlistWithId: id =>
    config.get(`/wp-json/learnpress/v1/wishlist/course/${id}`),

  getAssignment: id => config.get(`/wp-json/learnpress/v1/assignments/${id}`),

  startAssignment: params =>
    config.post('/wp-json/learnpress/v1/assignments/start/', params),

  retakeAssignment: params =>
    config.post('/wp-json/learnpress/v1/assignments/retake/', params),

  saveSendAssignment: params =>
    config.multipartPost('/wp-json/learnpress/v1/assignments/submit/', params),

  deleteFileAssignment: params =>
    config.post(
      '/wp-json/learnpress/v1/assignments/delete-submit-file/',
      params,
    ),

  topCoursesWithStudent: () =>
    config.get(
      '/wp-json/learnpress/v1/courses',
      {
        popular: true,
        optimize: true,
      },
      false,
    ),

  newCourses: () =>
    config.get(
      '/wp-json/learnpress/v1/courses',
      {
        order: 'desc',
        optimize: true,
      },
      false,
    ),

  getIntructor: params =>
    config.get('/wp-json/learnpress/v1/users', {...params}),

  getCategoryHome: () =>
    config.get(
      '/wp-json/learnpress/v1/course_category',
      {
        orderby: 'count',
        order: 'desc',
      },
      false,
    ),
  getReview: (id, params) =>
    config.get(`/wp-json/learnpress/v1/review/course/${id}`, params),

  createReview: param =>
    config.post('/wp-json/learnpress/v1/review/submit', param),

  checkAnswer: params =>
    config.post('/wp-json/learnpress/v1/quiz/check_answer', params),

  resetEmail: params =>
    config.post('/wp-json/learnpress/v1/users/reset-password', params),

  changePassword: params =>
    config.post('/wp-json/learnpress/v1/users/change-password', params),

  verifyReceipt: params =>
    config.post('/wp-json/learnpress/v1/courses/verify-receipt', params),

  deleteAccount: params =>
    config.post('/wp-json/learnpress/v1/users/delete', params),

  getProductIAP: params =>
    config.get('/wp-json/lp/v1/mobile-app/product-iap', {...params}),

  registerFCMToken: params =>
    config.post('/wp-json/learnpress/v1/push-notifications/register-device', {
      ...params,
    }),

  deleteFCMToken: params =>
    config.post('/wp-json/learnpress/v1/push-notifications/delete-device', {
      ...params,
    }),

  getNotifications: params =>
    config.get('/wp-json/learnpress/v1/push-notifications/get-notifications', {
      ...params,
    }),
};

export default Client;
