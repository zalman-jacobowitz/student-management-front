/**
 * Transaction Category Utility
 * Categorizes bank transactions based on keywords in descriptions
 */

// Category types
export const TRANSACTION_CATEGORIES = {
  PUBLIC_TRANSPORTATION: 'תחבורה ציבורית',
  PRIVATE_TRANSPORTATION: 'תחבורה פרטית',
  TRANSFER: 'העברות',
  MOBILE: 'מהטלפון',
  FOOD: 'אוכל',
  UTILITIES: 'שירותים',
  ENTERTAINMENT: 'בידור',
  SERVICES: 'שירותים אחרים',
  SHOPPING: 'קניות ועוד',
  OTHER: 'אחר',
};

// Category mapping patterns - keywords to search for in description
const CATEGORY_PATTERNS = {
  [TRANSACTION_CATEGORIES.PUBLIC_TRANSPORTATION]: ['MTA', 'TRANSIT', 'METRO', 'BUS', 'TRAIN', 'RAIL'],
  [TRANSACTION_CATEGORIES.PRIVATE_TRANSPORTATION]: ['UBER', 'LYFT', 'TAXI', 'GAS', 'PARKING', 'CAR'],
  [TRANSACTION_CATEGORIES.TRANSFER]: ['ZELLE', 'TRANSFER', 'WIRE', 'ACH', 'PAYPAL'],
  [TRANSACTION_CATEGORIES.MOBILE]: ['APPLE', 'PHONE', 'SPRINT', 'VERIZON', 'AT&T'],
  [TRANSACTION_CATEGORIES.FOOD]: ['CAFE', 'PIZZA', 'RESTAURANT', 'SUPERMARKET', 'FOOD', 'BAGEL', 'DELI', 'BURGER', 'COFFEE'],
  [TRANSACTION_CATEGORIES.UTILITIES]: ['GOOGLE', 'GITHUB', 'CLOUD', 'ELECTRIC', 'WATER', 'UTILITY'],
  [TRANSACTION_CATEGORIES.ENTERTAINMENT]: ['PLANET FITNESS', 'MOVIE', 'THEATER', 'CINEMA', 'CONCERT', 'GYM'],
  [TRANSACTION_CATEGORIES.SERVICES]: ['LAUNDRY', 'MIKVAH', 'BARBER', 'SALON', 'REPAIR'],
  [TRANSACTION_CATEGORIES.SHOPPING]: ['TARGET', 'CLOTHING', 'STORE', 'WALMART', 'AMAZON', 'MALL', 'SHOP'],
};

/**
 * Categorize a transaction based on its description
 * @param {string} description - Transaction description
 * @returns {string} Category name
 */
export function categorizeTransaction(description) {
  if (!description || typeof description !== 'string') {
    return TRANSACTION_CATEGORIES.OTHER;
  }

  const upperDescription = description.toUpperCase();

  // Check each category's patterns
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const pattern of patterns) {
      if (upperDescription.includes(pattern)) {
        return category;
      }
    }
  }

  return TRANSACTION_CATEGORIES.OTHER;
}

/**
 * Enrich transactions with category information
 * @param {Array} transactions - Array of transaction objects
 * @param {string} descriptionField - Field name containing description (default: 'Description')
 * @returns {Array} Array of transactions with added 'category' field
 */
export function enrichTransactionsWithCategory(
  transactions = [],
  descriptionField = 'Description'
) {
    console.log('transactions', transactions);
  return transactions.map((transaction) => ({
    ...transaction,
    category: categorizeTransaction(transaction[descriptionField] || ''),
  }));
}

/**
 * Group and summarize transactions by category
 * @param {Array} transactions - Array of transaction objects
 * @param {string} descriptionField - Field name containing description (default: 'Description')
 * @param {string} amountField - Field name containing amount (default: 'Amount')
 * @returns {Array} Array of grouped and summarized data
 */
export function groupTransactionsByCategory(
  transactions = [],
  descriptionField = 'Description',
  amountField = 'Amount'
) {
  // Step 1: Enrich transactions with category information
  const enrichedTransactions = enrichTransactionsWithCategory(transactions, descriptionField);
  console.log('enrichedTransactions', enrichedTransactions);
  // Step 2: Group by category
  const groupedData = {};

  // Initialize all categories
  Object.values(TRANSACTION_CATEGORIES).forEach((category) => {
    groupedData[category] = {
      cate: category,
      Amount: 0,
      count: 0,
    };
  });

  // Process each enriched transaction
  enrichedTransactions.forEach((transaction) => {
    const amount = parseFloat(transaction[amountField]);
    const category = transaction.category;

    groupedData[category].Amount += amount; // Works correctly with negative values
    groupedData[category].count += 1;
  });

  // Convert to array and sort by amount (descending)
  return {group : Object.values(groupedData) // Keep categories that have transactions
    .sort((a, b) => b.Amount - a.Amount)
, enrichedTransactions: enrichedTransactions  };
}

/**
 * Get category color for visualization
 * @param {string} category - Category name
 * @returns {string} Color code
 */
export function getCategoryColor(category) {
  const colorMap = {
    [TRANSACTION_CATEGORIES.PUBLIC_TRANSPORTATION]: '#FF6B6B',
    [TRANSACTION_CATEGORIES.PRIVATE_TRANSPORTATION]: '#E74C3C',
    [TRANSACTION_CATEGORIES.TRANSFER]: '#4ECDC4',
    [TRANSACTION_CATEGORIES.MOBILE]: '#45B7D1',
    [TRANSACTION_CATEGORIES.FOOD]: '#FFA07A',
    [TRANSACTION_CATEGORIES.UTILITIES]: '#98D8C8',
    [TRANSACTION_CATEGORIES.ENTERTAINMENT]: '#F7DC6F',
    [TRANSACTION_CATEGORIES.SERVICES]: '#BB8FCE',
    [TRANSACTION_CATEGORIES.SHOPPING]: '#F8B88B',
    [TRANSACTION_CATEGORIES.OTHER]: '#95A5A6',
  };

  return colorMap[category] || '#95A5A6';
}
