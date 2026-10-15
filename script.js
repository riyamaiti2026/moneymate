/* =====================================================
   MoneyMate – script.js
   Order of this file:
   1. Constants        2. Translations     3. Helper functions
   4. State + DOM refs 5. Render functions 6. Actions
   7. Event listeners  8. Start the app (last line)
   ===================================================== */
'use strict';

/* =====================================================
   1. CONSTANTS
   ===================================================== */
const STORAGE_KEY = 'moneymate.v1';
const MAX_AMOUNT = 1e12;
const LOCALES = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN' };
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const THEMES = ['auto', 'light', 'dark'];

const CATEGORIES = {
  expense: [
    { key: 'food', icon: '🍔' },
    { key: 'transport', icon: '🚌' },
    { key: 'bills', icon: '💡' },
    { key: 'shopping', icon: '🛍️' },
    { key: 'health', icon: '💊' },
    { key: 'education', icon: '📚' },
    { key: 'fun', icon: '🎬' },
    { key: 'otherExpense', icon: '🧾' }
  ],
  income: [
    { key: 'salary', icon: '💼' },
    { key: 'pocket', icon: '👛' },
    { key: 'business', icon: '🏪' },
    { key: 'gift', icon: '🎁' },
    { key: 'otherIncome', icon: '💰' }
  ]
};

const CHART_COLORS = ['#F4A300', '#12805C', '#3B6FD4', '#C2362B', '#8E5BD6', '#0FA3B1', '#E4572E', '#6B7A90'];

/* =====================================================
   2. TRANSLATIONS (English, Hindi, Bengali)
   ===================================================== */
const I18N = {
  en: {
    pageTitle: 'MoneyMate – Your free money manager',
    skipToContent: 'Skip to content',
    period: 'Period', allTime: 'All time', language: 'Language', currency: 'Currency',
    toggleTheme: 'Switch light or dark theme',
    tagline: 'Know where your money goes.',
    balance: 'Balance', income: 'Income', expenses: 'Expenses', savingsRate: 'Savings rate', txCount: 'Transactions',
    addTransaction: 'Add a transaction', editTransaction: 'Edit transaction',
    typeExpense: 'Expense', typeIncome: 'Income', transactionType: 'Transaction type',
    labelTitle: 'What was it for?', labelAmount: 'Amount', labelDate: 'Date', labelCategory: 'Category',
    phTitle: 'e.g. Lunch, Bus fare, Salary', phAmount: '0.00',
    btnAdd: 'Add transaction', btnSave: 'Save changes', btnCancel: 'Cancel',
    errTitle: 'Enter what the money was for.',
    errAmount: 'Enter an amount greater than 0.',
    errDate: 'Choose a valid date.',
    toastAdded: 'Transaction added.', toastUpdated: 'Changes saved.', toastDeleted: 'Transaction deleted.', undo: 'Undo',
    budgetTitle: 'Monthly budget', budgetLabel: 'Spending limit per month', phBudget: 'e.g. 15000', saveBudget: 'Save budget',
    budgetNone: 'Set a monthly limit to see how much you can still spend.',
    budgetUsed: '{spent} spent of {budget} in {month}',
    budgetLeft: '{amount} left to spend.',
    budgetWarn: 'Careful: you have used {percent}% of your budget.',
    budgetOver: 'Over budget by {amount}. Try cutting back on non-essentials.',
    toastBudgetSaved: 'Budget saved.', toastBudgetCleared: 'Budget removed.',
    errBudget: 'Enter 0 or a positive number.',
    insightsTitle: 'Insights', topCategory: 'Top spending category', biggestExpense: 'Biggest expense',
    biggestIncome: 'Biggest income', avgDaily: 'Average spend per day',
    chartCategory: 'Spending by category', chartMonthly: 'Income vs expenses, last 6 months',
    noExpenseData: 'No expenses in this period yet. Add one to see your chart.',
    noMonthlyData: 'Add some transactions to see monthly trends.',
    chartsOffline: 'Charts could not load. Check your internet connection and refresh the page.',
    goalsTitle: 'Savings goals', goalName: 'Goal', goalTarget: 'Target amount', goalDeadline: 'Deadline (optional)',
    phGoalName: 'e.g. New phone', addGoal: 'Add goal',
    noGoals: 'No goals yet. Add one above and track your progress.',
    goalProgress: '{saved} of {target} saved',
    goalPerMonth: 'Save {amount} per month for {months} month(s) to reach it.',
    goalReached: 'Goal reached! 🎉',
    goalOverdue: 'The deadline has passed. {amount} still needed.',
    goalNoDeadline: '{amount} still needed.',
    addMoney: 'Add', phAddMoney: 'Amount', deleteGoal: 'Delete goal',
    errGoalName: 'Enter a name for your goal.',
    errGoalTarget: 'Enter a target amount greater than 0.',
    errGoalMoney: 'Enter an amount greater than 0.',
    toastGoalAdded: 'Goal added.', toastGoalDeleted: 'Goal deleted.', toastMoneyAdded: 'Money added to your goal.',
    confirmDeleteGoal: 'Delete this goal?',
    historyTitle: 'History', searchLabel: 'Search transactions', searchPh: 'Search by name or category',
    filterType: 'Filter by type', filterCategory: 'Filter by category', sortLabel: 'Sort',
    allTypes: 'All types', allCategories: 'All categories',
    sortNewest: 'Newest first', sortOldest: 'Oldest first', sortHighest: 'Highest amount', sortLowest: 'Lowest amount',
    colDate: 'Date', colDetails: 'Details', colIn: 'In', colOut: 'Out',
    resultCount: '{n} transaction(s) shown',
    noTransactions: 'No transactions yet. Add your first one, or load sample data below.',
    noMatch: 'Nothing matches your search or filters.',
    edit: 'Edit', delete: 'Delete',
    dataTitle: 'Your data',
    privacyNote: 'Everything is saved only in this browser, on this device. Nothing is sent to a server. Download a backup now and then.',
    exportCsv: 'Export CSV (Excel)', exportJson: 'Download backup', importJson: 'Restore backup',
    printReport: 'Print report', loadSample: 'Load sample data', clearAll: 'Delete all data',
    toastExported: 'File downloaded.', toastImported: 'Backup restored.',
    errImport: 'That file is not a valid MoneyMate backup.',
    confirmImport: 'Restoring will replace your current data. Continue?',
    confirmClear: 'This will delete all your transactions, goals and budget. This cannot be undone. Continue?',
    toastCleared: 'All data deleted.', toastSample: 'Sample data added.',
    errStorage: 'Could not save. Your browser may be blocking storage.',
    footerText: 'Built with HTML, CSS and JavaScript. Your data never leaves your device.',
    cat_food: 'Food', cat_transport: 'Transport', cat_bills: 'Bills', cat_shopping: 'Shopping',
    cat_health: 'Health', cat_education: 'Education', cat_fun: 'Fun', cat_otherExpense: 'Other',
    cat_salary: 'Salary', cat_pocket: 'Pocket money', cat_business: 'Business', cat_gift: 'Gift',
    cat_otherIncome: 'Other income'
  },

  hi: {
    pageTitle: 'MoneyMate – आपका मुफ़्त मनी मैनेजर',
    skipToContent: 'सीधे मुख्य सामग्री पर जाएँ',
    period: 'अवधि', allTime: 'सभी समय', language: 'भाषा', currency: 'मुद्रा',
    toggleTheme: 'लाइट या डार्क थीम बदलें',
    tagline: 'जानिए आपका पैसा कहाँ जाता है।',
    balance: 'शेष राशि', income: 'आय', expenses: 'खर्च', savingsRate: 'बचत दर', txCount: 'लेन-देन',
    addTransaction: 'लेन-देन जोड़ें', editTransaction: 'लेन-देन बदलें',
    typeExpense: 'खर्च', typeIncome: 'आय', transactionType: 'लेन-देन का प्रकार',
    labelTitle: 'यह किस लिए था?', labelAmount: 'राशि', labelDate: 'तारीख', labelCategory: 'श्रेणी',
    phTitle: 'जैसे: दोपहर का खाना, बस किराया, वेतन', phAmount: '0.00',
    btnAdd: 'लेन-देन जोड़ें', btnSave: 'बदलाव सहेजें', btnCancel: 'रद्द करें',
    errTitle: 'लिखें कि पैसा किस लिए था।',
    errAmount: '0 से अधिक राशि लिखें।',
    errDate: 'सही तारीख चुनें।',
    toastAdded: 'लेन-देन जोड़ दिया गया।', toastUpdated: 'बदलाव सहेज लिए गए।', toastDeleted: 'लेन-देन हटा दिया गया।', undo: 'वापस लाएँ',
    budgetTitle: 'मासिक बजट', budgetLabel: 'हर महीने खर्च की सीमा', phBudget: 'जैसे: 15000', saveBudget: 'बजट सहेजें',
    budgetNone: 'मासिक सीमा तय करें, फिर देखें कि आप और कितना खर्च कर सकते हैं।',
    budgetUsed: '{month} में {budget} में से {spent} खर्च हुआ',
    budgetLeft: 'खर्च करने के लिए {amount} बचे हैं।',
    budgetWarn: 'सावधान: आप बजट का {percent}% इस्तेमाल कर चुके हैं।',
    budgetOver: 'बजट से {amount} ज़्यादा खर्च हो गया है। गैर-ज़रूरी खर्च घटाएँ।',
    toastBudgetSaved: 'बजट सहेज लिया गया।', toastBudgetCleared: 'बजट हटा दिया गया।',
    errBudget: '0 या कोई धनात्मक संख्या लिखें।',
    insightsTitle: 'मुख्य जानकारी', topCategory: 'सबसे ज़्यादा खर्च वाली श्रेणी', biggestExpense: 'सबसे बड़ा खर्च',
    biggestIncome: 'सबसे बड़ी आय', avgDaily: 'प्रतिदिन औसत खर्च',
    chartCategory: 'श्रेणी के अनुसार खर्च', chartMonthly: 'आय बनाम खर्च, पिछले 6 महीने',
    noExpenseData: 'इस अवधि में अभी कोई खर्च नहीं है। चार्ट देखने के लिए एक खर्च जोड़ें।',
    noMonthlyData: 'मासिक रुझान देखने के लिए कुछ लेन-देन जोड़ें।',
    chartsOffline: 'चार्ट लोड नहीं हो सके। इंटरनेट कनेक्शन जाँचें और पेज रीफ़्रेश करें।',
    goalsTitle: 'बचत लक्ष्य', goalName: 'लक्ष्य', goalTarget: 'लक्ष्य राशि', goalDeadline: 'अंतिम तारीख (वैकल्पिक)',
    phGoalName: 'जैसे: नया फ़ोन', addGoal: 'लक्ष्य जोड़ें',
    noGoals: 'अभी कोई लक्ष्य नहीं है। ऊपर जोड़ें और अपनी प्रगति देखें।',
    goalProgress: '{target} में से {saved} बचाए',
    goalPerMonth: 'लक्ष्य पाने के लिए {months} महीने तक हर महीने {amount} बचाएँ।',
    goalReached: 'लक्ष्य पूरा हुआ! 🎉',
    goalOverdue: 'अंतिम तारीख निकल चुकी है। अभी {amount} और चाहिए।',
    goalNoDeadline: 'अभी {amount} और चाहिए।',
    addMoney: 'जोड़ें', phAddMoney: 'राशि', deleteGoal: 'लक्ष्य हटाएँ',
    errGoalName: 'अपने लक्ष्य का नाम लिखें।',
    errGoalTarget: '0 से अधिक लक्ष्य राशि लिखें।',
    errGoalMoney: '0 से अधिक राशि लिखें।',
    toastGoalAdded: 'लक्ष्य जोड़ दिया गया।', toastGoalDeleted: 'लक्ष्य हटा दिया गया।', toastMoneyAdded: 'आपके लक्ष्य में पैसे जुड़ गए।',
    confirmDeleteGoal: 'क्या यह लक्ष्य हटाना है?',
    historyTitle: 'इतिहास', searchLabel: 'लेन-देन खोजें', searchPh: 'नाम या श्रेणी से खोजें',
    filterType: 'प्रकार से छाँटें', filterCategory: 'श्रेणी से छाँटें', sortLabel: 'क्रम',
    allTypes: 'सभी प्रकार', allCategories: 'सभी श्रेणियाँ',
    sortNewest: 'सबसे नया पहले', sortOldest: 'सबसे पुराना पहले', sortHighest: 'सबसे ज़्यादा राशि', sortLowest: 'सबसे कम राशि',
    colDate: 'तारीख', colDetails: 'विवरण', colIn: 'जमा', colOut: 'खर्च',
    resultCount: '{n} लेन-देन दिख रहे हैं',
    noTransactions: 'अभी कोई लेन-देन नहीं है। पहला जोड़ें, या नीचे से नमूना डेटा लोड करें।',
    noMatch: 'आपकी खोज या फ़िल्टर से कुछ नहीं मिला।',
    edit: 'बदलें', delete: 'हटाएँ',
    dataTitle: 'आपका डेटा',
    privacyNote: 'सब कुछ सिर्फ़ इसी डिवाइस के इसी ब्राउज़र में सहेजा जाता है। कुछ भी किसी सर्वर पर नहीं भेजा जाता। समय-समय पर बैकअप डाउनलोड करें।',
    exportCsv: 'CSV निर्यात करें (Excel)', exportJson: 'बैकअप डाउनलोड करें', importJson: 'बैकअप वापस लाएँ',
    printReport: 'रिपोर्ट प्रिंट करें', loadSample: 'नमूना डेटा लोड करें', clearAll: 'सारा डेटा हटाएँ',
    toastExported: 'फ़ाइल डाउनलोड हो गई।', toastImported: 'बैकअप वापस आ गया।',
    errImport: 'यह फ़ाइल सही MoneyMate बैकअप नहीं है।',
    confirmImport: 'बैकअप वापस लाने से मौजूदा डेटा बदल जाएगा। आगे बढ़ें?',
    confirmClear: 'इससे आपके सभी लेन-देन, लक्ष्य और बजट हट जाएँगे। इसे वापस नहीं किया जा सकता। आगे बढ़ें?',
    toastCleared: 'सारा डेटा हटा दिया गया।', toastSample: 'नमूना डेटा जोड़ दिया गया।',
    errStorage: 'सहेजा नहीं जा सका। हो सकता है आपका ब्राउज़र स्टोरेज रोक रहा हो।',
    footerText: 'HTML, CSS और JavaScript से बना। आपका डेटा आपके डिवाइस से बाहर नहीं जाता।',
    cat_food: 'खाना', cat_transport: 'यातायात', cat_bills: 'बिल', cat_shopping: 'खरीदारी',
    cat_health: 'स्वास्थ्य', cat_education: 'शिक्षा', cat_fun: 'मनोरंजन', cat_otherExpense: 'अन्य',
    cat_salary: 'वेतन', cat_pocket: 'जेब खर्च', cat_business: 'व्यापार', cat_gift: 'उपहार',
    cat_otherIncome: 'अन्य आय'
  },

  bn: {
    pageTitle: 'MoneyMate – আপনার বিনামূল্যের মানি ম্যানেজার',
    skipToContent: 'মূল অংশে যান',
    period: 'সময়কাল', allTime: 'সব সময়', language: 'ভাষা', currency: 'মুদ্রা',
    toggleTheme: 'লাইট বা ডার্ক থিম বদলান',
    tagline: 'জানুন আপনার টাকা কোথায় যায়।',
    balance: 'ব্যালেন্স', income: 'আয়', expenses: 'খরচ', savingsRate: 'সঞ্চয়ের হার', txCount: 'লেনদেন',
    addTransaction: 'লেনদেন যোগ করুন', editTransaction: 'লেনদেন সম্পাদনা করুন',
    typeExpense: 'খরচ', typeIncome: 'আয়', transactionType: 'লেনদেনের ধরন',
    labelTitle: 'এটা কীসের জন্য?', labelAmount: 'পরিমাণ', labelDate: 'তারিখ', labelCategory: 'বিভাগ',
    phTitle: 'যেমন: দুপুরের খাবার, বাস ভাড়া, বেতন', phAmount: '0.00',
    btnAdd: 'লেনদেন যোগ করুন', btnSave: 'পরিবর্তন সংরক্ষণ করুন', btnCancel: 'বাতিল',
    errTitle: 'টাকাটা কীসের জন্য তা লিখুন।',
    errAmount: '0-এর বেশি পরিমাণ লিখুন।',
    errDate: 'সঠিক তারিখ বেছে নিন।',
    toastAdded: 'লেনদেন যোগ হয়েছে।', toastUpdated: 'পরিবর্তন সংরক্ষিত হয়েছে।', toastDeleted: 'লেনদেন মুছে ফেলা হয়েছে।', undo: 'ফিরিয়ে আনুন',
    budgetTitle: 'মাসিক বাজেট', budgetLabel: 'প্রতি মাসে খরচের সীমা', phBudget: 'যেমন: 15000', saveBudget: 'বাজেট সংরক্ষণ করুন',
    budgetNone: 'মাসিক সীমা ঠিক করুন, তাহলে দেখতে পাবেন আর কত খরচ করতে পারবেন।',
    budgetUsed: '{month} মাসে {budget}-এর মধ্যে {spent} খরচ হয়েছে',
    budgetLeft: 'খরচ করার জন্য আর {amount} বাকি আছে।',
    budgetWarn: 'সাবধান: আপনি বাজেটের {percent}% খরচ করে ফেলেছেন।',
    budgetOver: 'বাজেটের চেয়ে {amount} বেশি খরচ হয়েছে। অপ্রয়োজনীয় খরচ কমান।',
    toastBudgetSaved: 'বাজেট সংরক্ষিত হয়েছে।', toastBudgetCleared: 'বাজেট সরানো হয়েছে।',
    errBudget: '0 বা কোনো ধনাত্মক সংখ্যা লিখুন।',
    insightsTitle: 'মূল তথ্য', topCategory: 'সবচেয়ে বেশি খরচের বিভাগ', biggestExpense: 'সবচেয়ে বড় খরচ',
    biggestIncome: 'সবচেয়ে বড় আয়', avgDaily: 'দৈনিক গড় খরচ',
    chartCategory: 'বিভাগ অনুযায়ী খরচ', chartMonthly: 'আয় বনাম খরচ, গত ৬ মাস',
    noExpenseData: 'এই সময়ে এখনো কোনো খরচ নেই। চার্ট দেখতে একটি খরচ যোগ করুন।',
    noMonthlyData: 'মাসিক প্রবণতা দেখতে কিছু লেনদেন যোগ করুন।',
    chartsOffline: 'চার্ট লোড হয়নি। ইন্টারনেট সংযোগ দেখে পেজ রিফ্রেশ করুন।',
    goalsTitle: 'সঞ্চয়ের লক্ষ্য', goalName: 'লক্ষ্য', goalTarget: 'লক্ষ্যমাত্রা', goalDeadline: 'শেষ তারিখ (ঐচ্ছিক)',
    phGoalName: 'যেমন: নতুন ফোন', addGoal: 'লক্ষ্য যোগ করুন',
    noGoals: 'এখনো কোনো লক্ষ্য নেই। উপরে যোগ করে অগ্রগতি দেখুন।',
    goalProgress: '{target}-এর মধ্যে {saved} জমেছে',
    goalPerMonth: 'লক্ষ্যে পৌঁছাতে {months} মাস ধরে প্রতি মাসে {amount} জমান।',
    goalReached: 'লক্ষ্য পূর্ণ হয়েছে! 🎉',
    goalOverdue: 'শেষ তারিখ পেরিয়ে গেছে। আরও {amount} দরকার।',
    goalNoDeadline: 'আরও {amount} দরকার।',
    addMoney: 'যোগ করুন', phAddMoney: 'পরিমাণ', deleteGoal: 'লক্ষ্য মুছুন',
    errGoalName: 'আপনার লক্ষ্যের নাম লিখুন।',
    errGoalTarget: '0-এর বেশি লক্ষ্যমাত্রা লিখুন।',
    errGoalMoney: '0-এর বেশি পরিমাণ লিখুন।',
    toastGoalAdded: 'লক্ষ্য যোগ হয়েছে।', toastGoalDeleted: 'লক্ষ্য মুছে ফেলা হয়েছে।', toastMoneyAdded: 'আপনার লক্ষ্যে টাকা যোগ হয়েছে।',
    confirmDeleteGoal: 'এই লক্ষ্যটি মুছবেন?',
    historyTitle: 'ইতিহাস', searchLabel: 'লেনদেন খুঁজুন', searchPh: 'নাম বা বিভাগ দিয়ে খুঁজুন',
    filterType: 'ধরন অনুযায়ী ছাঁকুন', filterCategory: 'বিভাগ অনুযায়ী ছাঁকুন', sortLabel: 'ক্রম',
    allTypes: 'সব ধরন', allCategories: 'সব বিভাগ',
    sortNewest: 'নতুন আগে', sortOldest: 'পুরনো আগে', sortHighest: 'সর্বোচ্চ পরিমাণ', sortLowest: 'সর্বনিম্ন পরিমাণ',
    colDate: 'তারিখ', colDetails: 'বিবরণ', colIn: 'জমা', colOut: 'খরচ',
    resultCount: '{n}টি লেনদেন দেখানো হচ্ছে',
    noTransactions: 'এখনো কোনো লেনদেন নেই। প্রথমটি যোগ করুন, অথবা নিচ থেকে নমুনা ডেটা লোড করুন।',
    noMatch: 'আপনার খোঁজ বা ফিল্টারের সঙ্গে কিছু মেলেনি।',
    edit: 'সম্পাদনা', delete: 'মুছুন',
    dataTitle: 'আপনার ডেটা',
    privacyNote: 'সবকিছু শুধু এই ডিভাইসের এই ব্রাউজারে সংরক্ষিত থাকে। কিছুই কোনো সার্ভারে পাঠানো হয় না। মাঝেমধ্যে ব্যাকআপ ডাউনলোড করে রাখুন।',
    exportCsv: 'CSV এক্সপোর্ট (Excel)', exportJson: 'ব্যাকআপ ডাউনলোড', importJson: 'ব্যাকআপ ফিরিয়ে আনুন',
    printReport: 'রিপোর্ট প্রিন্ট করুন', loadSample: 'নমুনা ডেটা লোড করুন', clearAll: 'সব ডেটা মুছুন',
    toastExported: 'ফাইল ডাউনলোড হয়েছে।', toastImported: 'ব্যাকআপ ফিরিয়ে আনা হয়েছে।',
    errImport: 'এই ফাইলটি সঠিক MoneyMate ব্যাকআপ নয়।',
    confirmImport: 'ব্যাকআপ ফিরিয়ে আনলে বর্তমান ডেটা বদলে যাবে। এগোবেন?',
    confirmClear: 'এতে আপনার সব লেনদেন, লক্ষ্য ও বাজেট মুছে যাবে। এটি আর ফেরানো যাবে না। এগোবেন?',
    toastCleared: 'সব ডেটা মুছে ফেলা হয়েছে।', toastSample: 'নমুনা ডেটা যোগ হয়েছে।',
    errStorage: 'সংরক্ষণ করা যায়নি। আপনার ব্রাউজার হয়তো স্টোরেজ আটকে রেখেছে।',
    footerText: 'HTML, CSS ও JavaScript দিয়ে তৈরি। আপনার ডেটা আপনার ডিভাইসের বাইরে যায় না।',
    cat_food: 'খাবার', cat_transport: 'যাতায়াত', cat_bills: 'বিল', cat_shopping: 'কেনাকাটা',
    cat_health: 'স্বাস্থ্য', cat_education: 'শিক্ষা', cat_fun: 'বিনোদন', cat_otherExpense: 'অন্যান্য',
    cat_salary: 'বেতন', cat_pocket: 'হাতখরচ', cat_business: 'ব্যবসা', cat_gift: 'উপহার',
    cat_otherIncome: 'অন্যান্য আয়'
  }
};

/* =====================================================
   3. HELPER FUNCTIONS (small tools used everywhere)
   ===================================================== */
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// Today's date as YYYY-MM-DD in the user's own time zone
function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function currentMonthKey() {
  return todayStr().slice(0, 7);
}

function monthKey(dateStr) {
  return dateStr.slice(0, 7);
}

function isValidDateStr(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const parts = s.split('-').map(Number);
  const y = parts[0], m = parts[1], d = parts[2];
  if (y < 1900 || y > 2200) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

// Days since 1970 at midnight UTC (safe for counting days between two dates)
function dayNumber(str) {
  const p = str.split('-').map(Number);
  return Date.UTC(p[0], p[1] - 1, p[2]);
}

function parseAmount(value) {
  const n = Number(String(value).trim());
  return isFinite(n) ? round2(n) : NaN;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function allCategoryKeys(type) {
  return CATEGORIES[type].map(function (c) { return c.key; });
}

function fallbackCategory(type) {
  return type === 'income' ? 'otherIncome' : 'otherExpense';
}

function categoryInfo(key) {
  const all = CATEGORIES.expense.concat(CATEGORIES.income);
  for (let i = 0; i < all.length; i++) {
    if (all[i].key === key) return all[i];
  }
  return { key: key, icon: '🧾' };
}

/* ---------- Saved data: checking and cleaning ---------- */
function defaultState() {
  return {
    transactions: [],
    goals: [],
    budget: 0,
    settings: { lang: 'en', currency: 'INR', theme: 'auto' }
  };
}

function cleanTransaction(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const type = raw.type === 'income' ? 'income' : (raw.type === 'expense' ? 'expense' : null);
  const amount = Number(raw.amount);
  const title = typeof raw.title === 'string' ? raw.title.trim().slice(0, 80) : '';
  if (!type || !isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) return null;
  if (!title || !isValidDateStr(raw.date)) return null;
  const category = allCategoryKeys(type).indexOf(raw.category) !== -1 ? raw.category : fallbackCategory(type);
  const id = (raw.id !== undefined && raw.id !== null && String(raw.id)) ? String(raw.id) : makeId();
  return { id: id, title: title, amount: round2(amount), type: type, category: category, date: raw.date };
}

function cleanGoal(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 60) : '';
  const target = Number(raw.target);
  let saved = Number(raw.saved);
  if (!name || !isFinite(target) || target <= 0 || target > MAX_AMOUNT) return null;
  if (!isFinite(saved) || saved < 0) saved = 0;
  const id = (raw.id !== undefined && raw.id !== null && String(raw.id)) ? String(raw.id) : makeId();
  return {
    id: id,
    name: name,
    target: round2(target),
    saved: round2(saved),
    deadline: isValidDateStr(raw.deadline) ? raw.deadline : ''
  };
}

function sanitizeState(data) {
  const base = defaultState();
  if (!data || typeof data !== 'object') return base;
  const usedIds = {};

  function uniqueId(item) {
    if (usedIds[item.id]) item.id = makeId();
    usedIds[item.id] = true;
    return item;
  }

  if (Array.isArray(data.transactions)) {
    base.transactions = data.transactions.map(cleanTransaction).filter(Boolean).map(uniqueId);
  }
  if (Array.isArray(data.goals)) {
    base.goals = data.goals.map(cleanGoal).filter(Boolean).map(uniqueId);
  }
  const budget = Number(data.budget);
  base.budget = isFinite(budget) && budget > 0 && budget <= MAX_AMOUNT ? round2(budget) : 0;

  const s = data.settings;
  if (s && typeof s === 'object') {
    if (LOCALES[s.lang]) base.settings.lang = s.lang;
    if (CURRENCIES.indexOf(s.currency) !== -1) base.settings.currency = s.currency;
    if (THEMES.indexOf(s.theme) !== -1) base.settings.theme = s.theme;
  }
  return base;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return sanitizeState(JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

/* =====================================================
   4. STATE AND PAGE ELEMENTS
   ===================================================== */
let state = loadState();

// Things that only live while the page is open (not saved)
const ui = {
  period: 'all',
  editingId: null,
  search: '',
  filterType: 'all',
  filterCategory: 'all',
  sort: 'newest'
};

let categoryChart = null;
let monthlyChart = null;

function $(id) {
  return document.getElementById(id);
}

const els = {
  periodSelect: $('periodSelect'), langSelect: $('langSelect'), currencySelect: $('currencySelect'), themeBtn: $('themeBtn'),
  balanceValue: $('balanceValue'), incomeValue: $('incomeValue'), expenseValue: $('expenseValue'),
  rateValue: $('rateValue'), countValue: $('countValue'),
  txForm: $('txForm'), formTitle: $('formTitle'), txTitle: $('txTitle'), txAmount: $('txAmount'), txDate: $('txDate'),
  txCategory: $('txCategory'), txSubmit: $('txSubmit'), txCancel: $('txCancel'), formError: $('formError'),
  budgetForm: $('budgetForm'), budgetInput: $('budgetInput'), budgetError: $('budgetError'), budgetText: $('budgetText'),
  budgetBarWrap: $('budgetBarWrap'), budgetBar: $('budgetBar'), budgetHint: $('budgetHint'),
  insTop: $('insTop'), insBiggestExpense: $('insBiggestExpense'), insBiggestIncome: $('insBiggestIncome'), insAvg: $('insAvg'),
  categoryWrap: $('categoryWrap'), categoryCanvas: $('categoryCanvas'), categoryEmpty: $('categoryEmpty'),
  monthlyWrap: $('monthlyWrap'), monthlyCanvas: $('monthlyCanvas'), monthlyEmpty: $('monthlyEmpty'),
  chartsGrid: $('chartsGrid'), chartsOffline: $('chartsOffline'),
  goalForm: $('goalForm'), goalName: $('goalName'), goalTarget: $('goalTarget'), goalDeadline: $('goalDeadline'),
  goalError: $('goalError'), goalsList: $('goalsList'), goalsEmpty: $('goalsEmpty'),
  searchInput: $('searchInput'), typeFilter: $('typeFilter'), categoryFilter: $('categoryFilter'), sortSelect: $('sortSelect'),
  resultCount: $('resultCount'), txHead: $('txHead'), txList: $('txList'), txEmpty: $('txEmpty'),
  exportCsvBtn: $('exportCsvBtn'), exportJsonBtn: $('exportJsonBtn'), importJsonBtn: $('importJsonBtn'),
  importFile: $('importFile'), printBtn: $('printBtn'), sampleBtn: $('sampleBtn'), clearBtn: $('clearBtn'),
  toasts: $('toasts')
};

/* ---------- Helpers that need the state ---------- */
function t(key, params) {
  const lang = state.settings.lang;
  let text = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  if (params) {
    Object.keys(params).forEach(function (name) {
      text = text.split('{' + name + '}').join(String(params[name]));
    });
  }
  return text;
}

function categoryLabel(key) {
  return t('cat_' + key);
}

function formatMoney(n) {
  const digits = Number.isInteger(n) ? 0 : 2;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: state.settings.currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(n);
  } catch (e) {
    return String(n);
  }
}

function formatCompact(n) {
  try {
    return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
  } catch (e) {
    return String(n);
  }
}

function formatDate(dateStr) {
  const p = dateStr.split('-').map(Number);
  try {
    return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(LOCALES[state.settings.lang], {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}

function monthLabel(key, format) {
  const p = key.split('-').map(Number);
  try {
    return new Date(p[0], p[1] - 1, 1).toLocaleDateString(LOCALES[state.settings.lang], format);
  } catch (e) {
    return key;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    showToast(t('errStorage'), { kind: 'error' });
    return false;
  }
}

function inPeriod(tx) {
  return ui.period === 'all' || monthKey(tx.date) === ui.period;
}

function periodTransactions() {
  return state.transactions.filter(inPeriod);
}

function totals(list) {
  let income = 0;
  let expense = 0;
  list.forEach(function (tx) {
    if (tx.type === 'income') income += tx.amount;
    else expense += tx.amount;
  });
  income = round2(income);
  expense = round2(expense);
  return { income: income, expense: expense, balance: round2(income - expense) };
}

function expenseByCategory(expenses) {
  const result = {};
  expenses.forEach(function (tx) {
    result[tx.category] = round2((result[tx.category] || 0) + tx.amount);
  });
  return result;
}

function getFormType() {
  const checked = document.querySelector('input[name="txType"]:checked');
  return checked ? checked.value : 'expense';
}

function setFormType(type) {
  const radio = document.querySelector('input[name="txType"][value="' + type + '"]');
  if (radio) radio.checked = true;
}

/* ---------- Theme ---------- */
function effectiveTheme() {
  const pref = state.settings.theme;
  if (pref === 'light' || pref === 'dark') return pref;
  const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return dark ? 'dark' : 'light';
}

function applyTheme() {
  const theme = effectiveTheme();
  document.documentElement.setAttribute('data-theme', theme);
  els.themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ---------- Translations on the page ---------- */
function applyTranslations() {
  document.documentElement.lang = state.settings.lang;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(function (node) {
    node.textContent = t(node.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (node) {
    node.setAttribute('placeholder', t(node.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (node) {
    node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria')));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function (node) {
    node.setAttribute('title', t(node.getAttribute('data-i18n-title')));
  });
}

/* ---------- Toast messages ---------- */
function showToast(message, options) {
  options = options || {};
  const toast = el('div', 'toast' + (options.kind === 'error' ? ' error' : ''));
  toast.appendChild(el('span', 'toast-msg', message));
  let timer = null;

  function close() {
    clearTimeout(timer);
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }

  if (options.actionLabel && options.onAction) {
    const btn = el('button', 'toast-action', options.actionLabel);
    btn.type = 'button';
    btn.addEventListener('click', function () {
      close();
      options.onAction();
    });
    toast.appendChild(btn);
  }

  els.toasts.appendChild(toast);
  while (els.toasts.children.length > 3) {
    els.toasts.removeChild(els.toasts.firstChild);
  }
  timer = setTimeout(close, options.actionLabel ? 6000 : 3500);
}

/* =====================================================
   5. RENDER FUNCTIONS (draw the data on the page)
   ===================================================== */
function renderPeriodOptions() {
  const months = {};
  state.transactions.forEach(function (tx) { months[monthKey(tx.date)] = true; });
  months[currentMonthKey()] = true;
  const keys = Object.keys(months).sort().reverse();

  if (ui.period !== 'all' && !months[ui.period]) ui.period = 'all';

  els.periodSelect.innerHTML = '';
  els.periodSelect.appendChild(new Option(t('allTime'), 'all'));
  keys.forEach(function (k) {
    els.periodSelect.appendChild(new Option(monthLabel(k, { month: 'long', year: 'numeric' }), k));
  });
  els.periodSelect.value = ui.period;
}

function renderFormCategories(selected) {
  const type = getFormType();
  els.txCategory.innerHTML = '';
  CATEGORIES[type].forEach(function (c) {
    els.txCategory.appendChild(new Option(c.icon + ' ' + categoryLabel(c.key), c.key));
  });
  if (selected && allCategoryKeys(type).indexOf(selected) !== -1) {
    els.txCategory.value = selected;
  }
}

function renderFilterOptions() {
  els.categoryFilter.innerHTML = '';
  els.categoryFilter.appendChild(new Option(t('allCategories'), 'all'));
  CATEGORIES.expense.concat(CATEGORIES.income).forEach(function (c) {
    els.categoryFilter.appendChild(new Option(c.icon + ' ' + categoryLabel(c.key), c.key));
  });
  els.categoryFilter.value = ui.filterCategory;
}

function updateFormMode() {
  const editing = ui.editingId !== null;
  els.formTitle.textContent = editing ? t('editTransaction') : t('addTransaction');
  els.txSubmit.textContent = editing ? t('btnSave') : t('btnAdd');
  els.txCancel.textContent = t('btnCancel');
  els.txCancel.hidden = !editing;
}

function renderLedger() {
  const list = periodTransactions();
  const sum = totals(list);
  els.balanceValue.textContent = formatMoney(sum.balance);
  els.balanceValue.classList.toggle('negative', sum.balance < 0);
  els.incomeValue.textContent = formatMoney(sum.income);
  els.expenseValue.textContent = formatMoney(sum.expense);
  els.rateValue.textContent = sum.income > 0 ? Math.round((sum.balance / sum.income) * 100) + '%' : '—';
  els.countValue.textContent = String(list.length);
}

function renderBudget() {
  const month = ui.period === 'all' ? currentMonthKey() : ui.period;
  let spent = 0;
  state.transactions.forEach(function (tx) {
    if (tx.type === 'expense' && monthKey(tx.date) === month) spent += tx.amount;
  });
  spent = round2(spent);
  const budget = state.budget;

  els.budgetBar.className = 'bar-fill';

  if (!(budget > 0)) {
    els.budgetText.textContent = t('budgetNone');
    els.budgetBar.style.width = '0%';
    els.budgetBarWrap.setAttribute('aria-valuenow', '0');
    els.budgetHint.textContent = '';
    return;
  }

  const percent = Math.round((spent / budget) * 100);
  const shown = Math.min(100, percent);
  els.budgetText.textContent = t('budgetUsed', {
    spent: formatMoney(spent),
    budget: formatMoney(budget),
    month: monthLabel(month, { month: 'long', year: 'numeric' })
  });
  els.budgetBar.style.width = shown + '%';
  els.budgetBarWrap.setAttribute('aria-valuenow', String(shown));

  if (spent > budget) {
    els.budgetBar.classList.add('over');
    els.budgetHint.textContent = t('budgetOver', { amount: formatMoney(round2(spent - budget)) });
  } else if (percent >= 80) {
    els.budgetBar.classList.add('warn');
    els.budgetHint.textContent = t('budgetWarn', { percent: percent });
  } else {
    els.budgetBar.classList.add('ok');
    els.budgetHint.textContent = t('budgetLeft', { amount: formatMoney(round2(budget - spent)) });
  }
}

function daysInSpan(expenses) {
  if (ui.period !== 'all') {
    if (ui.period === currentMonthKey()) return new Date().getDate();
    const p = ui.period.split('-').map(Number);
    return new Date(p[0], p[1], 0).getDate();
  }
  if (!expenses.length) return 1;
  let min = expenses[0].date;
  let max = expenses[0].date;
  expenses.forEach(function (e) {
    if (e.date < min) min = e.date;
    if (e.date > max) max = e.date;
  });
  return Math.max(1, Math.round((dayNumber(max) - dayNumber(min)) / 86400000) + 1);
}

function renderInsights() {
  const list = periodTransactions();
  const expenses = list.filter(function (tx) { return tx.type === 'expense'; });
  const incomes = list.filter(function (tx) { return tx.type === 'income'; });
  const dash = '—';

  // Top category
  const byCat = expenseByCategory(expenses);
  let topKey = null;
  let topValue = 0;
  Object.keys(byCat).forEach(function (k) {
    if (byCat[k] > topValue) { topValue = byCat[k]; topKey = k; }
  });
  els.insTop.textContent = topKey
    ? categoryInfo(topKey).icon + ' ' + categoryLabel(topKey) + ' (' + formatMoney(topValue) + ')'
    : dash;

  // Biggest expense and biggest income
  function biggest(items) {
    let best = null;
    items.forEach(function (tx) { if (!best || tx.amount > best.amount) best = tx; });
    return best;
  }
  const bigExp = biggest(expenses);
  const bigInc = biggest(incomes);
  els.insBiggestExpense.textContent = bigExp ? bigExp.title + ' (' + formatMoney(bigExp.amount) + ')' : dash;
  els.insBiggestIncome.textContent = bigInc ? bigInc.title + ' (' + formatMoney(bigInc.amount) + ')' : dash;

  // Average spend per day
  if (expenses.length) {
    const total = totals(expenses).expense;
    els.insAvg.textContent = formatMoney(round2(total / daysInSpan(expenses)));
  } else {
    els.insAvg.textContent = dash;
  }
}

/* ---------- Charts ---------- */
function themeColors() {
  const dark = effectiveTheme() === 'dark';
  return {
    text: dark ? '#A3AEC6' : '#55607A',
    grid: dark ? '#2A3957' : '#D3D9E6',
    surface: dark ? '#141E33' : '#FFFFFF',
    income: dark ? '#3DD6A0' : '#12805C',
    expense: dark ? '#FF7A6E' : '#C2362B'
  };
}

function categoryColor(key) {
  const keys = allCategoryKeys('expense');
  const index = keys.indexOf(key);
  return CHART_COLORS[(index < 0 ? 0 : index) % CHART_COLORS.length];
}

function lastSixMonthKeys() {
  const anchor = (ui.period === 'all' ? currentMonthKey() : ui.period).split('-').map(Number);
  const keys = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(anchor[0], anchor[1] - 1 - i, 1);
    keys.push(d.getFullYear() + '-' + pad(d.getMonth() + 1));
  }
  return keys;
}

function renderCategoryChart(colors) {
  if (categoryChart) { categoryChart.destroy(); categoryChart = null; }

  const expenses = periodTransactions().filter(function (tx) { return tx.type === 'expense'; });
  const byCat = expenseByCategory(expenses);
  const keys = allCategoryKeys('expense').filter(function (k) { return byCat[k] > 0; });
  const hasData = keys.length > 0;

  els.categoryWrap.hidden = !hasData;
  els.categoryEmpty.hidden = hasData;
  if (!hasData) return;

  categoryChart = new Chart(els.categoryCanvas, {
    type: 'doughnut',
    data: {
      labels: keys.map(function (k) { return categoryInfo(k).icon + ' ' + categoryLabel(k); }),
      datasets: [{
        data: keys.map(function (k) { return byCat[k]; }),
        backgroundColor: keys.map(categoryColor),
        borderColor: colors.surface,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
        tooltip: {
          callbacks: {
            label: function (ctx) { return ' ' + ctx.label + ': ' + formatMoney(ctx.parsed); }
          }
        }
      }
    }
  });
}

function renderMonthlyChart(colors) {
  if (monthlyChart) { monthlyChart.destroy(); monthlyChart = null; }

  const keys = lastSixMonthKeys();
  const incomeData = keys.map(function () { return 0; });
  const expenseData = keys.map(function () { return 0; });
  let hasData = false;

  state.transactions.forEach(function (tx) {
    const i = keys.indexOf(monthKey(tx.date));
    if (i === -1) return;
    hasData = true;
    if (tx.type === 'income') incomeData[i] = round2(incomeData[i] + tx.amount);
    else expenseData[i] = round2(expenseData[i] + tx.amount);
  });

  els.monthlyWrap.hidden = !hasData;
  els.monthlyEmpty.hidden = hasData;
  if (!hasData) return;

  monthlyChart = new Chart(els.monthlyCanvas, {
    type: 'bar',
    data: {
      labels: keys.map(function (k) { return monthLabel(k, { month: 'short' }); }),
      datasets: [
        { label: t('income'), data: incomeData, backgroundColor: colors.income, borderRadius: 4 },
        { label: t('expenses'), data: expenseData, backgroundColor: colors.expense, borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          grid: { color: colors.grid },
          ticks: { callback: function (value) { return formatCompact(value); } }
        }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
        tooltip: {
          callbacks: {
            label: function (ctx) { return ' ' + ctx.dataset.label + ': ' + formatMoney(ctx.parsed.y); }
          }
        }
      }
    }
  });
}

function renderCharts() {
  const available = typeof Chart !== 'undefined';
  els.chartsOffline.hidden = available;
  els.chartsGrid.hidden = !available;
  if (!available) return;
  const colors = themeColors();
  Chart.defaults.color = colors.text;
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  renderCategoryChart(colors);
  renderMonthlyChart(colors);
}

/* ---------- Goals ---------- */
function goalNote(goal) {
  const remaining = round2(goal.target - goal.saved);
  if (remaining <= 0) return t('goalReached');
  if (!goal.deadline) return t('goalNoDeadline', { amount: formatMoney(remaining) });
  const today = dayNumber(todayStr());
  const due = dayNumber(goal.deadline);
  if (due < today) return t('goalOverdue', { amount: formatMoney(remaining) });
  const days = Math.round((due - today) / 86400000);
  const months = Math.max(1, Math.ceil(days / 30));
  return t('goalPerMonth', { amount: formatMoney(round2(remaining / months)), months: months });
}

function renderGoals() {
  els.goalsList.innerHTML = '';
  els.goalsEmpty.hidden = state.goals.length > 0;

  state.goals.forEach(function (goal) {
    const li = el('li', 'goal');
    li.setAttribute('data-id', goal.id);

    const head = el('div', 'goal-head');
    head.appendChild(el('h3', 'goal-name', goal.name));
    const del = el('button', 'icon-btn', '✕');
    del.type = 'button';
    del.setAttribute('data-action', 'delete-goal');
    del.setAttribute('aria-label', t('deleteGoal') + ': ' + goal.name);
    del.title = t('deleteGoal');
    head.appendChild(del);
    li.appendChild(head);

    const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
    li.appendChild(el('p', 'goal-progress', t('goalProgress', {
      saved: formatMoney(goal.saved),
      target: formatMoney(goal.target)
    }) + ' (' + percent + '%)'));

    const bar = el('div', 'bar');
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(percent));
    bar.setAttribute('aria-label', goal.name);
    const fill = el('div', 'bar-fill ' + (goal.saved >= goal.target ? 'done' : 'ok'));
    fill.style.width = percent + '%';
    bar.appendChild(fill);
    li.appendChild(bar);

    li.appendChild(el('p', 'goal-note muted small', goalNote(goal)));

    const form = el('form', 'inline-form goal-add');
    form.setAttribute('data-id', goal.id);
    form.noValidate = true;
    const input = el('input');
    input.type = 'number';
    input.min = '0.01';
    input.step = '0.01';
    input.inputMode = 'decimal';
    input.placeholder = t('phAddMoney');
    input.setAttribute('aria-label', t('addMoney') + ': ' + goal.name);
    const btn = el('button', 'btn small', t('addMoney'));
    btn.type = 'submit';
    form.appendChild(input);
    form.appendChild(btn);
    li.appendChild(form);

    els.goalsList.appendChild(li);
  });
}

/* ---------- History (the ledger table) ---------- */
function getVisibleTransactions() {
  const q = ui.search.trim().toLowerCase();
  const list = periodTransactions().filter(function (tx) {
    if (ui.filterType !== 'all' && tx.type !== ui.filterType) return false;
    if (ui.filterCategory !== 'all' && tx.category !== ui.filterCategory) return false;
    if (q) {
      const haystack = (tx.title + ' ' + categoryLabel(tx.category)).toLowerCase();
      if (haystack.indexOf(q) === -1) return false;
    }
    return true;
  });

  // Start with the most recently added first, then sort (sorting keeps that order for equal dates)
  list.reverse();
  if (ui.sort === 'newest') {
    list.sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); });
  } else if (ui.sort === 'oldest') {
    list.reverse();
    list.sort(function (a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0); });
  } else if (ui.sort === 'highest') {
    list.sort(function (a, b) { return b.amount - a.amount; });
  } else if (ui.sort === 'lowest') {
    list.sort(function (a, b) { return a.amount - b.amount; });
  }
  return list;
}

function renderHistory() {
  const list = getVisibleTransactions();
  els.txList.innerHTML = '';

  const hasAny = state.transactions.length > 0;
  els.txHead.hidden = list.length === 0;
  els.txEmpty.hidden = list.length > 0;
  els.txEmpty.textContent = hasAny ? t('noMatch') : t('noTransactions');
  els.resultCount.textContent = list.length ? t('resultCount', { n: list.length }) : '';

  list.forEach(function (tx) {
    const info = categoryInfo(tx.category);
    const li = el('li', 'tx ' + tx.type);
    li.setAttribute('data-id', tx.id);

    li.appendChild(el('span', 'tx-date', formatDate(tx.date)));

    const who = el('span', 'tx-who');
    const icon = el('span', 'tx-icon', info.icon);
    icon.setAttribute('aria-hidden', 'true');
    const text = el('span', 'tx-text');
    text.appendChild(el('strong', 'tx-title', tx.title));
    text.appendChild(el('span', 'tx-cat', categoryLabel(tx.category)));
    who.appendChild(icon);
    who.appendChild(text);
    li.appendChild(who);

    li.appendChild(el('span', 'tx-in', tx.type === 'income' ? formatMoney(tx.amount) : ''));
    li.appendChild(el('span', 'tx-out', tx.type === 'expense' ? formatMoney(tx.amount) : ''));

    const actions = el('span', 'tx-actions');
    const edit = el('button', 'icon-btn', '✏️');
    edit.type = 'button';
    edit.setAttribute('data-action', 'edit-tx');
    edit.setAttribute('aria-label', t('edit') + ': ' + tx.title);
    edit.title = t('edit');
    const del = el('button', 'icon-btn', '🗑️');
    del.type = 'button';
    del.setAttribute('data-action', 'delete-tx');
    del.setAttribute('aria-label', t('delete') + ': ' + tx.title);
    del.title = t('delete');
    actions.appendChild(edit);
    actions.appendChild(del);
    li.appendChild(actions);

    els.txList.appendChild(li);
  });
}

// Draw everything
function render() {
  renderPeriodOptions();
  renderLedger();
  renderBudget();
  renderInsights();
  renderCharts();
  renderGoals();
  renderHistory();
}

// Redraw everything after the language changes
function refreshLanguage() {
  const selectedCategory = els.txCategory.value;
  applyTranslations();
  renderFormCategories(selectedCategory);
  renderFilterOptions();
  updateFormMode();
  render();
}

/* =====================================================
   6. ACTIONS (things the user does)
   ===================================================== */
function resetForm(keepDate) {
  ui.editingId = null;
  els.txTitle.value = '';
  els.txAmount.value = '';
  els.formError.textContent = '';
  if (!keepDate) els.txDate.value = todayStr();
  updateFormMode();
}

function startEdit(id) {
  const tx = state.transactions.find(function (x) { return x.id === id; });
  if (!tx) return;
  ui.editingId = id;
  setFormType(tx.type);
  renderFormCategories(tx.category);
  els.txTitle.value = tx.title;
  els.txAmount.value = String(tx.amount);
  els.txDate.value = tx.date;
  els.formError.textContent = '';
  updateFormMode();
  els.txForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  els.txTitle.focus({ preventScroll: true });
}

function deleteTransaction(id) {
  const index = state.transactions.findIndex(function (x) { return x.id === id; });
  if (index === -1) return;
  const removed = state.transactions.splice(index, 1)[0];
  if (ui.editingId === id) resetForm(true);
  saveState();
  render();
  showToast(t('toastDeleted'), {
    actionLabel: t('undo'),
    onAction: function () {
      state.transactions.splice(Math.min(index, state.transactions.length), 0, removed);
      saveState();
      render();
    }
  });
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  showToast(t('toastExported'));
}

// Wrap a value for CSV and stop spreadsheet formulas from running
function csvCell(value) {
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

function exportCsv() {
  if (!state.transactions.length) {
    showToast(t('noTransactions'), { kind: 'error' });
    return;
  }
  const header = [t('colDate'), t('colDetails'), t('transactionType'), t('labelCategory'), t('labelAmount')]
    .map(csvCell).join(',');
  const rows = state.transactions.slice().sort(function (a, b) {
    return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0);
  }).map(function (tx) {
    return [
      csvCell(tx.date),
      csvCell(tx.title),
      csvCell(tx.type === 'income' ? t('typeIncome') : t('typeExpense')),
      csvCell(categoryLabel(tx.category)),
      String(tx.amount)
    ].join(',');
  });
  // The \uFEFF at the start makes Excel read Hindi and Bengali text correctly
  downloadFile('moneymate-' + todayStr() + '.csv', '\uFEFF' + [header].concat(rows).join('\r\n'), 'text/csv;charset=utf-8');
}

function exportJson() {
  const backup = {
    app: 'MoneyMate',
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions: state.transactions,
    goals: state.goals,
    budget: state.budget
  };
  downloadFile('moneymate-backup-' + todayStr() + '.json', JSON.stringify(backup, null, 2), 'application/json');
}

function importJsonFile(file) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast(t('errImport'), { kind: 'error' });
    return;
  }
  const reader = new FileReader();
  reader.onerror = function () {
    showToast(t('errImport'), { kind: 'error' });
  };
  reader.onload = function () {
    let data;
    try {
      data = JSON.parse(String(reader.result));
    } catch (e) {
      showToast(t('errImport'), { kind: 'error' });
      return;
    }
    const looksRight = data && typeof data === 'object' &&
      (Array.isArray(data.transactions) || Array.isArray(data.goals));
    if (!looksRight) {
      showToast(t('errImport'), { kind: 'error' });
      return;
    }
    if (!window.confirm(t('confirmImport'))) return;
    const cleaned = sanitizeState(data);
    state.transactions = cleaned.transactions;
    state.goals = cleaned.goals;
    state.budget = cleaned.budget;
    ui.editingId = null;
    saveState();
    els.budgetInput.value = state.budget > 0 ? String(state.budget) : '';
    updateFormMode();
    render();
    showToast(t('toastImported'));
  };
  reader.readAsText(file);
}

function loadSampleData() {
  const now = new Date();
  const todayDay = now.getDate();
  // [title, type, category, amount, day of month]
  const rows = [
    ['Monthly salary', 'income', 'salary', 30000, 1],
    ['Freelance work', 'income', 'business', 4500, 12],
    ['Groceries', 'expense', 'food', 2400, 3],
    ['Lunch with friends', 'expense', 'food', 650, 9],
    ['Bus and metro pass', 'expense', 'transport', 900, 5],
    ['Electricity bill', 'expense', 'bills', 1800, 8],
    ['Mobile recharge', 'expense', 'bills', 399, 10],
    ['Online course', 'expense', 'education', 1499, 14],
    ['New headphones', 'expense', 'shopping', 2199, 17],
    ['Movie night', 'expense', 'fun', 500, 20],
    ['Medicines', 'expense', 'health', 450, 22]
  ];

  for (let back = 2; back >= 0; back--) {
    rows.forEach(function (row) {
      const day = row[4];
      if (back === 0 && day > todayDay) return; // no dates in the future
      const d = new Date(now.getFullYear(), now.getMonth() - back, day);
      const wiggle = row[1] === 'expense' ? ((back * 7 + day) % 5) * 20 : 0;
      state.transactions.push({
        id: makeId(),
        title: row[0],
        type: row[1],
        category: row[2],
        amount: row[3] + wiggle,
        date: d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
      });
    });
  }

  if (!state.goals.length) {
    const due = new Date(now.getFullYear(), now.getMonth() + 8, 1);
    state.goals.push({
      id: makeId(),
      name: 'New laptop',
      target: 60000,
      saved: 12000,
      deadline: due.getFullYear() + '-' + pad(due.getMonth() + 1) + '-' + pad(due.getDate())
    });
  }
  if (!(state.budget > 0)) {
    state.budget = 15000;
    els.budgetInput.value = '15000';
  }

  saveState();
  render();
  showToast(t('toastSample'));
}

function clearAllData() {
  if (!window.confirm(t('confirmClear'))) return;
  state.transactions = [];
  state.goals = [];
  state.budget = 0;
  ui.editingId = null;
  ui.period = 'all';
  saveState();
  els.budgetInput.value = '';
  resetForm(true);
  render();
  showToast(t('toastCleared'));
}

/* =====================================================
   7. EVENT LISTENERS (connect buttons to actions)
   ===================================================== */
function bindEvents() {
  // Top bar
  els.periodSelect.addEventListener('change', function () {
    ui.period = els.periodSelect.value;
    render();
  });

  els.langSelect.addEventListener('change', function () {
    if (!LOCALES[els.langSelect.value]) return;
    state.settings.lang = els.langSelect.value;
    saveState();
    refreshLanguage();
  });

  els.currencySelect.addEventListener('change', function () {
    if (CURRENCIES.indexOf(els.currencySelect.value) === -1) return;
    state.settings.currency = els.currencySelect.value;
    saveState();
    render();
  });

  els.themeBtn.addEventListener('click', function () {
    state.settings.theme = effectiveTheme() === 'dark' ? 'light' : 'dark';
    saveState();
    applyTheme();
    renderCharts();
  });

  if (window.matchMedia) {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = function () {
      if (state.settings.theme === 'auto') {
        applyTheme();
        renderCharts();
      }
    };
    if (query.addEventListener) query.addEventListener('change', onSystemChange);
    else if (query.addListener) query.addListener(onSystemChange);
  }

  // Add / edit transaction form
  document.querySelectorAll('input[name="txType"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      renderFormCategories();
    });
  });

  els.txForm.addEventListener('input', function () {
    els.formError.textContent = '';
  });

  els.txForm.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ui.editingId !== null) resetForm(false);
  });

  els.txCancel.addEventListener('click', function () {
    resetForm(false);
  });

  els.txForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const type = getFormType();
    const title = els.txTitle.value.trim();
    const amount = parseAmount(els.txAmount.value);
    const date = els.txDate.value;
    let category = els.txCategory.value;

    if (!title) {
      els.formError.textContent = t('errTitle');
      els.txTitle.focus();
      return;
    }
    if (!(amount > 0) || amount > MAX_AMOUNT) {
      els.formError.textContent = t('errAmount');
      els.txAmount.focus();
      return;
    }
    if (!isValidDateStr(date)) {
      els.formError.textContent = t('errDate');
      els.txDate.focus();
      return;
    }
    if (allCategoryKeys(type).indexOf(category) === -1) category = fallbackCategory(type);

    if (ui.editingId !== null) {
      const tx = state.transactions.find(function (x) { return x.id === ui.editingId; });
      if (tx) {
        tx.title = title.slice(0, 80);
        tx.amount = amount;
        tx.type = type;
        tx.category = category;
        tx.date = date;
      }
      showToast(t('toastUpdated'));
    } else {
      state.transactions.push({ id: makeId(), title: title.slice(0, 80), amount: amount, type: type, category: category, date: date });
      showToast(t('toastAdded'));
    }
    saveState();
    resetForm(true);
    render();
    els.txTitle.focus({ preventScroll: true });
  });

  // Budget
  els.budgetForm.addEventListener('input', function () {
    els.budgetError.textContent = '';
  });

  els.budgetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const raw = els.budgetInput.value.trim();
    const value = raw === '' ? 0 : parseAmount(raw);
    if (!isFinite(value) || value < 0 || value > MAX_AMOUNT) {
      els.budgetError.textContent = t('errBudget');
      return;
    }
    state.budget = value;
    saveState();
    renderBudget();
    showToast(value > 0 ? t('toastBudgetSaved') : t('toastBudgetCleared'));
  });

  // Goals
  els.goalForm.addEventListener('input', function () {
    els.goalError.textContent = '';
  });

  els.goalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = els.goalName.value.trim();
    const target = parseAmount(els.goalTarget.value);
    const deadline = els.goalDeadline.value;
    if (!name) {
      els.goalError.textContent = t('errGoalName');
      els.goalName.focus();
      return;
    }
    if (!(target > 0) || target > MAX_AMOUNT) {
      els.goalError.textContent = t('errGoalTarget');
      els.goalTarget.focus();
      return;
    }
    if (deadline && !isValidDateStr(deadline)) {
      els.goalError.textContent = t('errDate');
      els.goalDeadline.focus();
      return;
    }
    state.goals.push({ id: makeId(), name: name.slice(0, 60), target: target, saved: 0, deadline: deadline || '' });
    saveState();
    els.goalForm.reset();
    renderGoals();
    showToast(t('toastGoalAdded'));
  });

  els.goalsList.addEventListener('submit', function (e) {
    const form = e.target.closest('form.goal-add');
    if (!form) return;
    e.preventDefault();
    const id = form.getAttribute('data-id');
    const goal = state.goals.find(function (g) { return g.id === id; });
    const input = form.querySelector('input');
    const amount = parseAmount(input.value);
    if (!goal) return;
    if (!(amount > 0) || amount > MAX_AMOUNT) {
      showToast(t('errGoalMoney'), { kind: 'error' });
      input.focus();
      return;
    }
    goal.saved = round2(goal.saved + amount);
    saveState();
    renderGoals();
    showToast(t('toastMoneyAdded'));
  });

  els.goalsList.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action="delete-goal"]');
    if (!btn) return;
    const li = btn.closest('li');
    const id = li ? li.getAttribute('data-id') : null;
    if (!id) return;
    if (!window.confirm(t('confirmDeleteGoal'))) return;
    state.goals = state.goals.filter(function (g) { return g.id !== id; });
    saveState();
    renderGoals();
    showToast(t('toastGoalDeleted'));
  });

  // History filters and actions
  els.searchInput.addEventListener('input', function () {
    ui.search = els.searchInput.value;
    renderHistory();
  });
  els.typeFilter.addEventListener('change', function () {
    ui.filterType = els.typeFilter.value;
    renderHistory();
  });
  els.categoryFilter.addEventListener('change', function () {
    ui.filterCategory = els.categoryFilter.value;
    renderHistory();
  });
  els.sortSelect.addEventListener('change', function () {
    ui.sort = els.sortSelect.value;
    renderHistory();
  });

  els.txList.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const li = btn.closest('li');
    const id = li ? li.getAttribute('data-id') : null;
    if (!id) return;
    const action = btn.getAttribute('data-action');
    if (action === 'edit-tx') startEdit(id);
    else if (action === 'delete-tx') deleteTransaction(id);
  });

  // Data tools
  els.exportCsvBtn.addEventListener('click', exportCsv);
  els.exportJsonBtn.addEventListener('click', exportJson);
  els.importJsonBtn.addEventListener('click', function () { els.importFile.click(); });
  els.importFile.addEventListener('change', function () {
    importJsonFile(els.importFile.files && els.importFile.files[0]);
    els.importFile.value = '';
  });
  els.printBtn.addEventListener('click', function () { window.print(); });
  els.sampleBtn.addEventListener('click', loadSampleData);
  els.clearBtn.addEventListener('click', clearAllData);
}

/* =====================================================
   8. START THE APP
   ===================================================== */
function init() {
  applyTheme();
  els.langSelect.value = state.settings.lang;
  els.currencySelect.value = state.settings.currency;
  els.txDate.value = todayStr();
  els.budgetInput.value = state.budget > 0 ? String(state.budget) : '';
  applyTranslations();
  renderFormCategories();
  renderFilterOptions();
  updateFormMode();
  bindEvents();
  render();
}

init();
