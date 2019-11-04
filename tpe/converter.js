const xlsx = require('node-xlsx');
const csv = require('csv')

const csvFormatOptions = {
    cast: {
        date: (date) => date.toISOString()
    },
    header: true,
    columns: [
        'date',
        'concept',
        'category',
        'debit',
        'credit',
        'total',
        'balance',
    ]
}

const filename = process.argv[2];
const workSheetsFromFile = xlsx.parse(`${filename}`);

const parseNumber = n => parseFloat(n
    .replace('.', '')
    .replace(',', '.'))

const parseDate = d => {
    const [day, month, year] = d.split('/')
    return new Date(`${year}-${month}-${day}`)
}

const categories = {
    'salary': /(ACREDITAMIENTO DE HABERES)|(REEMBOLSO)|(DEP\. EFECTIVO)|(DEVOLUCION DE COMPRA)/i,
    'savings': /(TRANSF\. CTAS PROPIAS)/i,
    'food': /(rappi)|(bounan)|(MC DONALDS)|(quma)|(boulan)|(DIA TIENDA)|(STARBUCKS)|(COCO CAFE)|(QUOTIDIEN)|(LA FONDUE)|(TEA CONNECTION)/i,
    'home': /(FARMACIA)|(COTO)|(USINA LACTEA)|(EASY)|(JUMBO)/i,
    'cc': /(PAGO TARJETA)/i,
    'services': /(DEB\. AUTOM\. DE SERV)|(SERVICIO CUENTA SIMPLE)|(PAGO DE SERVICIOS)/i,
    'taxes': /(IVA)|(PROMO)|(INTERES CAPITALIZADO)/i,
    'cash': /(EXTRACCION CAJERO)|(TRANSF\. ENTRE CUENTAS)|(TRANSF DE TERCEROS)|(TRANSF A TERCEROS)/i,
    'transport': /(ACA PALERMO)|(GARAGE)|(HDI)|(ESTACIONAMIENTO)|(MERCADOPAGO\*SUBE)/i,
    'other': /(ITUNES)|(SPOTIFY)|(barber shop)|(MAC STATION)|(MERCADOPAGO)|(BUDA BAR)|(BREWDA)/i
}

const parseCategory = c => {
    for (const [key, pattern] of Object.entries(categories)) {
        const matched = pattern.exec(c)
        if (matched) {
            return { key: key, detail: matched[0] };
        }
    }
    return { key: `other`, detail: '???' }
}

const rawData = workSheetsFromFile[0].data.slice(6)
const data = rawData.map(raw => ({
    date: parseDate(raw[0]),
    concept: parseCategory(raw[1]).key,
    category: parseCategory(raw[1]).detail,
    debit: parseNumber(raw[2]),
    credit: parseNumber(raw[3]),
    total: parseNumber(raw[2]) + parseNumber(raw[3]),
    balance: parseNumber(raw[4])
}))

const maxBalance = data.reduce((balance, detail) => Math.max(balance, detail.balance), 0);
const adjustedData = data.map(detail => ({
    ...detail,
    balance: detail.balance / maxBalance,
    debit: detail.debit / maxBalance,
    credit: detail.credit / maxBalance,
    total: detail.total / maxBalance,
}))

csv.stringify(adjustedData, csvFormatOptions).pipe(process.stdout)
