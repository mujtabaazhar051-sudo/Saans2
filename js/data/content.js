/**
 * Saans — static bilingual content for tool pages
 */
(function () {
  'use strict';

  window.SAANS_CONTENT = {
    PKR_PER_USD: 278,

    badges: {
      time: [
        { id: 't1', icon: '🌱', days: 1 },
        { id: 't2', icon: '🌿', days: 3 },
        { id: 't3', icon: '⭐', days: 7 },
        { id: 't4', icon: '🌟', days: 14 },
        { id: 't5', icon: '🏆', days: 30 },
        { id: 't6', icon: '💎', days: 60 },
        { id: 't7', icon: '👑', days: 90 },
        { id: 't8', icon: '🦅', days: 180 },
        { id: 't9', icon: '🚀', days: 365 },
      ],
      milestone: [
        { id: 'm1', icon: '🚬', type: 'cigs', threshold: 10 },
        { id: 'm2', icon: '💨', type: 'cigs', threshold: 50 },
        { id: 'm3', icon: '🫁', type: 'cigs', threshold: 100 },
        { id: 'm4', icon: '🌬️', type: 'cigs', threshold: 500 },
        { id: 'm5', icon: '🌀', type: 'cigs', threshold: 1000 },
        { id: 'm6', icon: '💰', type: 'savings', threshold: 500 },
        { id: 'm7', icon: '💵', type: 'savings', threshold: 2000 },
        { id: 'm8', icon: '💳', type: 'savings', threshold: 10000 },
        { id: 'm9', icon: '🏦', type: 'savings', threshold: 50000 },
      ],
      streak: [
        { id: 's1', icon: '🔥', streak: 3 },
        { id: 's2', icon: '⚡', streak: 7 },
        { id: 's3', icon: '💪', streak: 14 },
        { id: 's4', icon: '🛡️', streak: 21 },
        { id: 's5', icon: '🌈', streak: 30 },
      ],
      labels: {
        ur: {
          time: [
            { name: 'پہلا دن', desc: 'سگریٹ چھوڑے 1 دن' },
            { name: '3 دن', desc: 'تین دن مکمل' },
            { name: 'پہلا ہفتہ', desc: '7 دن' },
            { name: 'دو ہفتے', desc: '14 دن' },
            { name: 'پہلا مہینہ', desc: '30 دن' },
            { name: 'دو مہینے', desc: '60 دن' },
            { name: 'تین مہینے', desc: '90 دن' },
            { name: 'چھ مہینے', desc: '180 دن' },
            { name: 'ایک سال', desc: '365 دن' },
          ],
          milestone: [
            { name: '10 سگریٹ', desc: '10 سگریٹ نہیں پیے' },
            { name: '50 سگریٹ', desc: '50 سے بچے' },
            { name: '100 سگریٹ', desc: '100 نہیں پیے' },
            { name: '500 سگریٹ', desc: '500 بچائے' },
            { name: '1000 سگریٹ', desc: '1000 نہیں پیے' },
            { name: 'PKR 500', desc: '500 روپے بچائے' },
            { name: 'PKR 2,000', desc: '2000 روپے بچائے' },
            { name: 'PKR 10,000', desc: '10000 روپے بچائے' },
            { name: 'PKR 50,000', desc: '50000 روپے بچائے' },
          ],
          streak: [
            { name: '3 دن سٹریک', desc: '3 دن لگاتار' },
            { name: '7 دن سٹریک', desc: '7 دن لگاتار' },
            { name: '14 دن سٹریک', desc: '14 دن لگاتار' },
            { name: '21 دن سٹریک', desc: '21 دن لگاتار' },
            { name: '30 دن سٹریک', desc: '30 دن لگاتار' },
          ],
        },
        en: {
          time: [
            { name: 'Day 1', desc: 'First smoke-free day' },
            { name: '3 Days', desc: 'Three days done' },
            { name: 'First Week', desc: '7 days strong' },
            { name: 'Two Weeks', desc: '14 days' },
            { name: 'First Month', desc: '30 days' },
            { name: 'Two Months', desc: '60 days' },
            { name: 'Three Months', desc: '90 days' },
            { name: 'Six Months', desc: '180 days' },
            { name: 'One Year', desc: '365 days' },
          ],
          milestone: [
            { name: '10 Cigs', desc: '10 avoided' },
            { name: '50 Cigs', desc: '50 avoided' },
            { name: '100 Cigs', desc: '100 avoided' },
            { name: '500 Cigs', desc: '500 avoided' },
            { name: '1000 Cigs', desc: '1000 avoided' },
            { name: 'PKR 500', desc: 'Saved PKR 500' },
            { name: 'PKR 2,000', desc: 'Saved PKR 2,000' },
            { name: 'PKR 10,000', desc: 'Saved PKR 10,000' },
            { name: 'PKR 50,000', desc: 'Saved PKR 50,000' },
          ],
          streak: [
            { name: '3-Day Streak', desc: '3 days in a row' },
            { name: '7-Day Streak', desc: '7 days in a row' },
            { name: '14-Day Streak', desc: '14 days in a row' },
            { name: '21-Day Streak', desc: '21 days in a row' },
            { name: '30-Day Streak', desc: '30 days in a row' },
          ],
        },
      },
    },

    health: {
      minutes: [20, 480, 720, 4320, 10080, 43200, 131400, 262800, 525600, 2628000],
      icons: ['💓', '🩸', '💨', '🫁', '👃', '🏃', '❤️', '🦷', '🎉', '🚀'],
      ur: [
        { time: '20 منٹ', title: 'بلڈ پریشر معمول پر', desc: 'بلڈ پریشر اور دل کی دھڑکن معمول پر آنا شروع ہو گئی۔' },
        { time: '8 گھنٹے', title: 'کاربن مونوآکسائیڈ کم', desc: 'خون میں CO کی سطح نصف ہو گئی۔' },
        { time: '12 گھنٹے', title: 'آکسیجن نارمل', desc: 'آکسیجن کی سطح معمول پر آ گئی۔' },
        { time: '3 دن', title: 'نکوٹین نکلی', desc: 'نکوٹین جسم سے نکل گئی۔' },
        { time: '1 ہفتہ', title: 'ذائقہ واپس', desc: 'حواس بحال ہو رہے ہیں۔' },
        { time: '1 مہینہ', title: 'پھیپھڑوں کی بہتری', desc: 'سانس اور کھانسی میں بہتری۔' },
        { time: '3 مہینے', title: 'گردش بہتر', desc: 'خون کی گردش بہتر ہوئی۔' },
        { time: '6 مہینے', title: 'پھیپھڑے صاف', desc: 'پھیپھڑوں میں رکاوٹ کم ہوئی۔' },
        { time: '1 سال', title: 'دل کا خطرہ 50٪ کم', desc: 'دل کی بیماری کا خطرہ آدھا۔' },
        { time: '5 سال', title: 'کینسر خطرہ کم', desc: 'کینسر کا خطرہ بہت کم ہو گیا۔' },
      ],
      en: [
        { time: '20 Minutes', title: 'Blood Pressure Normalising', desc: 'Heart rate begins returning to normal.' },
        { time: '8 Hours', title: 'Carbon Monoxide Halved', desc: 'CO in blood drops by half.' },
        { time: '12 Hours', title: 'Blood Oxygen Normal', desc: 'Oxygen levels back to normal.' },
        { time: '3 Days', title: 'Nicotine-Free', desc: 'Nicotine has left your body.' },
        { time: '1 Week', title: 'Taste & Smell Returning', desc: 'Your senses are coming back.' },
        { time: '1 Month', title: 'Lung Function Improving', desc: 'Less coughing, easier breathing.' },
        { time: '3 Months', title: 'Circulation Improving', desc: 'Walking and exercise feel easier.' },
        { time: '6 Months', title: 'Lungs Cleaner', desc: 'Mucus and blockage reduced greatly.' },
        { time: '1 Year', title: 'Heart Risk Halved', desc: 'Heart disease risk cut in half.' },
        { time: '5 Years', title: 'Cancer Risk Reduced', desc: 'Cancer risk dropped significantly.' },
      ],
    },

    quotes: {
      ur: [
        'ہر دن ایک نیا موقع ہے۔', 'تم اس سے زیادہ مضبوط ہو۔', 'خواہش آتی ہے، مگر گزر جاتی ہے۔',
        'آپ کا جسم آپ کا شکریہ ادا کر رہا ہے۔', 'ایک دن — بس اتنا کافی ہے۔',
        'آج کا فیصلہ کل کی آزادی ہے۔', 'گرنا بھی سفر کا حصہ ہے۔', 'آپ اپنے خاندان کے لیے بہتر بن رہے ہیں۔',
      ],
      en: [
        'Every day is a fresh start.', 'You are stronger than you think.', 'Cravings pass — stay with it.',
        'Your body is thanking you.', 'One day at a time is enough.', 'Today\'s choice is tomorrow\'s freedom.',
        'Setbacks are part of the journey.', 'You are becoming better for your family.',
      ],
    },

    tips: {
      ur: [
        { cat: 'craving', text: 'خواہش 3–5 منٹ میں گزر جاتی ہے — پانی پیئیں یا چہل قدمی کریں۔' },
        { cat: 'craving', text: 'گہری سانس لیں: 4 سیکنڈ اندر، 4 روکیں، 4 باہر۔' },
        { cat: 'habit', text: 'چائے کے بعد سگریٹ کی عادت بدلیں — پھل یا پانی رکھیں۔' },
        { cat: 'habit', text: 'سونے سے پہلے فون دور رکھیں — رات دیر تک سگریٹ کا وقت ہوتا ہے۔' },
        { cat: 'stress', text: 'ذہنی دباؤ میں 5 منٹ کی سانس کی مشق کریں۔' },
        { cat: 'social', text: 'دوستوں کو بتائیں کہ آپ چھوڑ رہے ہیں — مدد ملے گی۔' },
        { cat: 'health', text: 'روزانہ 10 منٹ چہل قدمی دل اور پھیپھڑوں کے لیے فائدہ مند ہے۔' },
        { cat: 'money', text: 'بچائے پیسے الگ جگہ رکھیں — ہفتہ وار انعام دیں۔' },
      ],
      en: [
        { cat: 'craving', text: 'Cravings last 3–5 minutes — drink water or take a short walk.' },
        { cat: 'craving', text: 'Deep breathing: 4 seconds in, hold 4, out 4.' },
        { cat: 'habit', text: 'Replace post-tea cigarette with fruit or water.' },
        { cat: 'habit', text: 'Keep phone away before bed — late night is a trigger.' },
        { cat: 'stress', text: 'Do 5 minutes of breathing when stressed.' },
        { cat: 'social', text: 'Tell friends you\'re quitting — they can support you.' },
        { cat: 'health', text: '10 minutes daily walking helps heart and lungs.' },
        { cat: 'money', text: 'Put saved money aside — reward yourself weekly.' },
      ],
      cats: {
        ur: { all: 'سب', craving: 'خواہش', habit: 'عادت', stress: 'ذہنی دباؤ', social: 'سماجی', health: 'صحت', money: 'پیسے' },
        en: { all: 'All', craving: 'Cravings', habit: 'Habits', stress: 'Stress', social: 'Social', health: 'Health', money: 'Money' },
      },
    },

    stories: {
      ur: [
        { name: 'احمد، کراچی', days: 90, text: 'پہلے ہفتہ مشکل تھا، مگر سانس نے روز یاد دلایا کہ میں کر سکتا ہوں۔' },
        { name: 'فاطمہ، لاہور', days: 180, text: 'بچوں کے لیے چھوڑا — اب وہ فخر محسوس کرتے ہیں۔' },
        { name: 'عمر، اسلام آباد', days: 365, text: 'ایک سال مکمل! PKR 80000 سے زیادہ بچائے۔' },
      ],
      en: [
        { name: 'Ahmed, Karachi', days: 90, text: 'First week was hard, but daily tracking kept me going.' },
        { name: 'Fatima, Lahore', days: 180, text: 'I quit for my kids — they are proud of me now.' },
        { name: 'Umar, Islamabad', days: 365, text: 'One full year! Saved over PKR 80,000.' },
      ],
    },

    helplines: {
      ur: [
        { name: 'پاکستان سگریٹ چھوڑنے ہیلپ لائن', num: '0800-67890', note: 'مفت، 24/7' },
        { name: 'SHO helpline (سگریٹ)', num: '111-738-738', note: 'مشورہ اور مدد' },
      ],
      en: [
        { name: 'Pakistan Quit Smoking Helpline', num: '0800-67890', note: 'Free, 24/7' },
        { name: 'SHO Helpline', num: '111-738-738', note: 'Counselling & support' },
      ],
      hospitals: {
        ur: [
          { city: 'کراچی', name: 'JPMC — سگریٹ چھوڑنے کلینک', phone: '021-99201300' },
          { city: 'لاہور', name: 'Mayo Hospital — Chest Clinic', phone: '042-99211101' },
          { city: 'اسلام آباد', name: 'PIMS — Pulmonology', phone: '051-9261170' },
        ],
        en: [
          { city: 'Karachi', name: 'JPMC — Quit Clinic', phone: '021-99201300' },
          { city: 'Lahore', name: 'Mayo Hospital — Chest Clinic', phone: '042-99211101' },
          { city: 'Islamabad', name: 'PIMS — Pulmonology', phone: '051-9261170' },
        ],
      },
    },

    resources: {
      books: {
        ur: [
          { title: 'الن اکار کا آسان طریقہ', author: 'ایلن کار', url: 'https://www.goodreads.com' },
          { title: 'سگریٹ چھوڑنے کی مکمل گائیڈ', author: 'WHO', url: 'https://www.who.int' },
        ],
        en: [
          { title: 'The Easy Way to Stop Smoking', author: 'Allen Carr', url: 'https://www.goodreads.com' },
          { title: 'WHO Quit Tobacco Guide', author: 'WHO', url: 'https://www.who.int' },
        ],
      },
      websites: {
        ur: [
          { title: 'WHO — تمباکو چھوڑنا', url: 'https://www.who.int/teams/health-promotion/tobacco-control' },
          { title: 'Smokefree.gov', url: 'https://smokefree.gov' },
        ],
        en: [
          { title: 'WHO — Tobacco Control', url: 'https://www.who.int/teams/health-promotion/tobacco-control' },
          { title: 'Smokefree.gov', url: 'https://smokefree.gov' },
        ],
      },
      videos: {
        ur: [
          { title: 'سگریٹ چھوڑنے کے فوائد', url: 'https://www.youtube.com/results?search_query=quit+smoking+benefits' },
        ],
        en: [
          { title: 'Benefits of Quitting Smoking', url: 'https://www.youtube.com/results?search_query=quit+smoking+benefits' },
        ],
      },
    },

    nicotine: {
      ur: {
        gum: { title: 'نکوٹین گم', pros: 'فوری امداد، لچکدار', cons: 'منہ میں جلن ہو سکتی ہے' },
        patch: { title: 'نکوٹین پچ', pros: '24 گھنٹے مدد، آسان', cons: 'جلد پر خارش' },
        quiz: [
          { q: 'آپ روزانہ کتنے سگریٹ پیتے تھے؟', opts: ['10 سے کم', '10–20', '20+'] },
          { q: 'صبح اٹھتے ہی سگریٹ؟', opts: ['ہاں', 'کبھی کبھی', 'نہیں'] },
          { q: 'پچھلے کوشش میں کیا مسئلہ؟', opts: ['خواہش', 'وزن', 'ذہنی دباؤ'] },
        ],
        resultGum: 'گم آپ کے لیے بہتر — فوری خواہش پر قابو پانے میں مدد کرے گی۔',
        resultPatch: 'پچ آپ کے لیے بہتر — مسلسل نکوٹین سے آسان چھوڑنا۔',
      },
      en: {
        gum: { title: 'Nicotine Gum', pros: 'Fast relief, flexible', cons: 'May irritate mouth' },
        patch: { title: 'Nicotine Patch', pros: '24h support, easy', cons: 'Skin irritation possible' },
        quiz: [
          { q: 'How many cigarettes per day?', opts: ['Under 10', '10–20', '20+'] },
          { q: 'Smoke within 30 min of waking?', opts: ['Yes', 'Sometimes', 'No'] },
          { q: 'Main challenge last attempt?', opts: ['Cravings', 'Weight', 'Stress'] },
        ],
        resultGum: 'Gum may suit you best for sudden cravings.',
        resultPatch: 'Patch may suit you best for steady all-day support.',
      },
    },

    savingsItems: [
      { icon: '☕', pkr: 3000, ur: 'ایک مہینے کی چائے', en: 'One month of tea' },
      { icon: '🍗', pkr: 5000, ur: 'خاندانی ڈنر', en: 'Family dinner out' },
      { icon: '👟', pkr: 8000, ur: 'نئے جوتے', en: 'New shoes' },
      { icon: '✈️', pkr: 18000, ur: 'کراچی–لاہور پرواز', en: 'Karachi–Lahore flight' },
      { icon: '📱', pkr: 35000, ur: 'بجٹ سمارٹ فون', en: 'Budget smartphone' },
      { icon: '🛵', pkr: 180000, ur: 'موٹر سائیکل', en: 'Motorcycle down payment' },
    ],
  };
})();
