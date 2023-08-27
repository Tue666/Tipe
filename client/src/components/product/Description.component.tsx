import { styled } from '@mui/material';
import ContentToggle from '../ContentToggle.component';
import { STYLE } from '@/configs/constants';

const Description = () => {
  return (
    <ContentToggle>
      <Content
        dangerouslySetInnerHTML={{
          __html:
            '<p>iPhone 13. Hệ thống camera kép tiên tiến nhất từng có trên iPhone. Chip A15 Bionic thần tốc. Bước nhảy vọt về thời lượng pin. Thiết kế bền bỉ. Mạng 5G siêu nhanh.<sup>1</sup> Cùng với màn hình Super Retina XDR sáng hơn.</p> <h3>Tính năng nổi bật</h3> <ul> <li>Màn hình Super Retina XDR 6.1 inch<sup>2</sup></li> <li>Chế độ Điện Ảnh làm tăng thêm độ sâu trường ảnh nông và tự động thay đổi tiêu cự trong video</li> <li>Hệ thống camera kép tiên tiến với camera Wide và Ultra Wide 12MP; Phong Cách Nhiếp Ảnh, HDR thông minh thế hệ 4, chế độ Ban Đêm, khả năng quay video HDR Dolby Vision 4K</li> <li>Camera trước TrueDepth 12MP với chế độ Ban Đêm và khả năng quay video HDR Dolby Vision 4K</li> <li>Chip A15 Bionic cho hiệu năng thần tốc</li> <li>Thời gian xem video lên đến 19 giờ<sup>3</sup></li> <li>Thiết kế bền bỉ với Ceramic Shield</li> <li>Khả năng chống nước đạt chuẩn IP68 đứng đầu thị trường<sup>4</sup></li> <li>Mạng 5G cho tốc độ tải xuống siêu nhanh, xem video và nghe nhạc trực tuyến chất lượng cao<sup>1</sup></li> <li>iOS 15 tích hợp nhiều tính năng mới cho phép bạn làm được nhiều việc hơn bao giờ hết với iPhone<sup>5</sup></li> <li>Hỗ trợ phụ kiện MagSafe giúp dễ dàng gắn kết và sạc không dây nhanh hơn<sup>6</sup></li> </ul> <h3>Pháp lý</h3> <p><sup>1</sup>Cần có gói cước dữ liệu. Mạng 5G chỉ khả dụng ở một số thị trường và được cung cấp qua một số nhà mạng. Tốc độ có thể thay đổi tùy địa điểm và nhà mạng. Để biết thông tin về hỗ trợ mạng 5G, vui lòng liên hệ nhà mạng và truy cập <a href="http://apple.com/iphone/cellular" rel="nofollow noreferrer">apple.com/iphone/cellular</a></p> <p><sup>2</sup>Màn hình có các góc bo tròn theo đường cong tuyệt đẹp và nằm gọn theo một hình chữ nhật chuẩn. Khi tính theo hình chữ nhật chuẩn, kích thước màn hình là 6.06 inch theo đường chéo. Diện tích hiển thị thực tế nhỏ hơn.</p> <p><sup>3</sup>Thời lượng pin khác nhau tùy theo cách sử dụng và cấu hình. Truy cập <a href="http://apple.com/batteries" rel="nofollow noreferrer">apple.com/batteries</a> để biết thêm thông tin.</p> <p><sup>4</sup>iPhone 13 có khả năng chống nước, chống tia nước và chống bụi. Sản phẩm đã qua kiểm nghiệm trong điều kiện phòng thí nghiệm có kiểm soát đạt mức IP68 theo tiêu chuẩn IEC 60529. Khả năng chống tia nước, chống nước và chống bụi không phải là các điều kiện vĩnh viễn. Khả năng này có thể giảm do hao mòn thông thường. Không sạc pin khi iPhone đang bị ướt. Vui lòng tham khảo hướng dẫn sử dụng để biết cách lau sạch và làm khô máy. Không bảo hành sản phẩm bị hỏng do thấm chất lỏng.</p> <p><sup>5</sup>Một số tính năng không khả dụng tại một số quốc gia hoặc khu vực.</p> <p><sup>6</sup>Phụ kiện được bán riêng.</p> <h3>Thông số kỹ thuật</h3> <p>Truy cập <a href="https://www.apple.com/iphone/compare/" rel="nofollow noreferrer">apple.com/iphone/compare</a> để xem cấu hình đầy đủ.</p><p>Giá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....</p>',
        }}
      />
    </ContentToggle>
  );
};

const Content = styled('div')({
  padding: '10px',
  marginBottom: '20px',
  maxHeight: STYLE.DESKTOP.PRODUCT.DESCRIPTION_MAX_HEIGHT,
  overflow: 'hidden',
  transition: 'all 0.5s',
});

export default Description;
