export const htmlEmailToken = (verifyUrl, otpToken) => {
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Email</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: Arial, Helvetica, sans-serif;
    }

    table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    img {
      display: block;
      border: 0;
    }

    @media screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }

      .padding {
        padding: 20px !important;
      }

      .otp {
        font-size: 22px !important;
        letter-spacing: 4px !important;
      }
    }
  </style>
</head>

<body>

  <table width="100%" bgcolor="#f4f4f4">
    <tr>
      <td align="center">

        <!-- CONTAINER -->
        <table width="600" class="container" style="background:#ffffff;border-radius:10px;overflow:hidden;">

          <!-- CONTENT -->
          <tr>
            <td class="padding" style="padding:30px;text-align:center;color:#333;">

              <h2 style="margin:0 0 10px 0;">Xác thực tài khoản</h2>

              <p style="margin:0 0 20px 0;font-size:14px;">
                Mã OTP của bạn là:
              </p>

              <!-- OTP BOX -->
              <div class="otp" style="
                display:inline-block;
                padding:15px 30px;
                font-size:28px;
                font-weight:bold;
                letter-spacing:6px;
                background:#f1f5f9;
                border-radius:8px;
                color:#0f172a;
                margin-bottom:20px;
              ">
                ${otpToken}
              </div>

              <p style="font-size:14px;margin:0 0 10px 0;">
                Mã sẽ hết hạn trong <b>60 giây</b>.
              </p>

              <p style="font-size:12px;color:#777;">
                Nếu bạn không yêu cầu, hãy bỏ qua email này.
              </p>

            </td>
          </tr>

          <!-- BUTTON (optional) -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <a href="${verifyUrl}" style="
                  background:#0f172a;
                  color:#ffffff;
                  padding:12px 25px;
                  text-decoration:none;
                  border-radius:6px;
                  font-size:14px;
                  display:inline-block;
                ">
                Xác nhận ngay
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding:20px;font-size:12px;color:#aaa;">
              © 2026 Your Company. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>

</html>
  `
}

