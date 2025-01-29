import Mock from 'mockjs';

Mock.mock('/api/data', 'get', {
  'list|1-10': [
    {
      'id|+1': 1,
      userImg: '@image(250x250)',
      nickname: '@cname',
      date: '@date',
      title: '@paragraph(5)',
      description: '@paragraph(55)',
      'imageArr|1-9': [
        {
          url: '@image(250x250)',
        },
      ],
      email: '@EMAIL',
      'userid|+1': 1,
      topping: false,
    },
  ],
});
console.log('执行mockjs');
