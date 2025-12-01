import { useTheme, alpha as hexAlpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import { Chart, useChart } from 'src/components/chart';

function extractZellePayerName(description) {
    console.log('description', description);
    if (!description) return null;
    // Pattern: "Zelle payment from NAME [for/Conf#]" or "Zelle payment to NAME [Conf#]"
    let match = description.match(/Zelle payment from (.+?)\s+(?:for|Conf#)/i);
    if (match) return match[1].trim();
    
    match = description.match(/Zelle payment to (.+?)\s+(?:Conf#|$)/i);
    return match ? match[1].trim() : null;
}

function groupZelleByPayer(transactions, transactionType = 'all') {
    const grouped = {};
    
    transactions.forEach(tx => {
        const payerName = extractZellePayerName(tx.Description);
        console.log('tx.Description', tx.Description);
        console.log('payerName', payerName);
        if (payerName) {
            const amount = parseFloat(tx.Amount);
            console.log('amount', tx.Amount);
            // סינון לפי סוג עסקה (חיובי או שלילי)
            if (transactionType === 'positive' && amount < 0) return;
            if (transactionType === 'negative' && amount >= 0) return;
            
            if (!grouped[payerName]) {
                grouped[payerName] = 0;
            }
            // השתמש בערך מוחלט לתצוגה
            grouped[payerName] += Math.abs(amount);
        }
    });
    
    return grouped;
}

function ZelleChart({ title, subheader, groupedByPayer, theme }) {
    const payerNames = Object.keys(groupedByPayer);
    const amounts = Object.values(groupedByPayer);
    
    const chartColors = [
        hexAlpha(theme.palette.primary.dark, 0.8),
        hexAlpha(theme.palette.warning.main, 0.8),
        hexAlpha(theme.palette.info.main, 0.8),
        hexAlpha(theme.palette.error.main, 0.8),
        hexAlpha(theme.palette.success.main, 0.8),
        hexAlpha(theme.palette.primary.light, 0.8),
        hexAlpha(theme.palette.primary.lighter, 0.8)
    ];

    const chartOptions = useChart({
        colors: chartColors,
        labels: payerNames,
        legend: {
            show: true,
        },
        tooltip: {
            y: {
                formatter: (value) => `$${value.toFixed(2)}`,
            },
        },
    });

    return (
        <Card>
            <CardHeader
                title={title}
                subheader={subheader}
                sx={{ mb: 3 }}
            />
            {payerNames.length > 0 ? (
                <Chart
                    type="pie"
                    series={amounts}
                    options={chartOptions}
                    height={364}
                    sx={{ py: 2.5, pl: 1, pr: 2.5 }}
                />
            ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    אין נתוני {title} להצגה
                </div>
            )}
        </Card>
    );
}

function Zelle({data}) {
    const theme = useTheme();

    const zelleTransactions = data.filter(tx => tx['category'] === "העברות");
        console.table(zelleTransactions);
    const positiveGrouped = groupZelleByPayer(zelleTransactions, 'positive');
    const negativeGrouped = groupZelleByPayer(zelleTransactions, 'negative');
    
    console.log('data', data);
    console.log('Zelle positive grouped:', positiveGrouped);
    console.log('Zelle negative grouped:', negativeGrouped);
    
    return (
        <>
        <Grid item xs={12} md={6}>
                <ZelleChart 
                    title="העברות Zelle נכנסות"
                    subheader="הכנסות לפי שם המעביר"
                    groupedByPayer={positiveGrouped}
                    theme={theme}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <ZelleChart 
                    title="העברות Zelle יוצאות"
                    subheader="הוצאות לפי שם המעביר"
                    groupedByPayer={negativeGrouped}
                    theme={theme}
                />
        </Grid>
        </>
    );
}

export default Zelle;