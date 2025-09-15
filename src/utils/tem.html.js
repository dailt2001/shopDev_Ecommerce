
export const htmlEmailToken = () => {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xác minh email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #4f46e5;
      color: #ffffff;
      text-align: center;
      padding: 24px;
      font-size: 20px;
      font-weight: bold;
    }
    .content {
      padding: 32px 24px;
      color: #333333;
      font-size: 15px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin: 24px 0;
      padding: 14px 28px;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
    }
    .footer {
      background: #f3f4f6;
      color: #666666;
      font-size: 13px;
      text-align: center;
      padding: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      Shop Ecommerce
    </div>
    <div class="content">
      <p>Xin chào {{username}},</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Shop Ecommerce</strong>.</p>
      <p>Vui lòng nhấn vào nút bên dưới để xác minh địa chỉ email của bạn:</p>

      <p style="text-align: center;">
        <a href="{{verify_url}}" class="button">Xác minh email</a>
      </p>

      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
    </div>
    <div class="footer">
      <p>Bạn nhận được email này vì đã đăng ký shop.ecommerce.com</p>
      <p>© 2025 Shop Ecommerce. Mọi quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
`
}