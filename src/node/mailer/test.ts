import Mailer from './index';
import createStripeTable from './template/card-stripe-table';

async function test(): Promise<any> {
  const data = [];
  const result = createStripeTable({
    title: '页面异常分布',
    column: [],
    list: data,
  });

  console.log(result);

  const mailer = Mailer.geInstance(
    'user-email',
    'password'
  );

  mailer.send({
    to: 'user-email',
    subject: 'test',
    html: result,
  });
}

test();
