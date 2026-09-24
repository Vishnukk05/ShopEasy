const fs = require('fs');

const fixReqParams = (file) => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    // For string | string[] errors
    content = content.replace(/req\.params;/gm, "req.params as any;");
    content = content.replace(/req\.query;/gm, "req.query as any;");
    content = content.replace(/const { (.+) } = req\.params/g, "const { $1 } = req.params as any");
    content = content.replace(/const { (.+) } = req\.query/g, "const { $1 } = req.query as any");
    fs.writeFileSync(file, content);
}
const files = [
    'src/controllers/inventory.controller.ts',
    'src/controllers/invoice.controller.ts',
    'src/controllers/order.controller.ts',
    'src/controllers/review.controller.ts',
    'src/controllers/shipping.controller.ts',
    'src/controllers/variant.controller.ts'
];
files.forEach(fixReqParams);

// 3. paymentId removal from OrderCreateInput
const removePaymentId = (file) => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/paymentId,\n/g, "");
    fs.writeFileSync(file, content);
}
removePaymentId('src/controllers/order.ts');
removePaymentId('src/controllers/payment.ts');

// 4. review.controller.ts req.user
let reviewPath = 'src/controllers/review.controller.ts';
if (fs.existsSync(reviewPath)) {
    let content = fs.readFileSync(reviewPath, 'utf8');
    content = content.replace(/req\.user/g, "(req as any).user");
    fs.writeFileSync(reviewPath, content);
}

// 5. index.ts securityMiddleware name
let indexPath = 'src/index.ts';
let indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent.replace(/securityMiddleware/g, "securityMiddlewares");
fs.writeFileSync(indexPath, indexContent);
