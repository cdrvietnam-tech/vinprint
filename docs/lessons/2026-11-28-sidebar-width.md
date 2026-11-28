# Menu trái phải vừa vùng rộng còn lại sau thanh cuộn dọc
- Issue: Muse168.
- Nguyên nhân gốc: white-space:nowrap kết hợp padding34px, gap15px và icon21px làm ba nhãn dài tràn khi thanh cuộn dọc chiếm16px.
- Sửa: cỡ chữ13px, padding ngang10px, gap9px, icon18px, cho ngắt dòng theo từ; không cắt nhãn hoặc dùng overflow:hidden để che lỗi. Mobile giữ vùng bấm ít nhất44px.
- Chặn bằng scripts/verify-sidebar-fit.cjs: ép scrollbar-gutter:stable, đo scrollWidth <= clientWidth và không có mục clipped ở1781/1366/1024/900/768/390px trên trang chủ và trang sản phẩm.
- Red: bản cũ ở1781px có client207/scroll216, ba nhãn tràn. Green: đủ12trường hợp scroll==client và clipped rỗng. Ảnh/JSON trong docs/evidence/tet-storefront/sidebar-fit.
- Phạm vi nghiệm thu: thanh bên. Thanh trên cùng có tràn sẵn tại1024px, không dùng kiểm tra menu này để khẳng định toàn trang không cuộn ngang ở mọi cỡ.
