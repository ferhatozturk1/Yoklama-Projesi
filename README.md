🚀 QR Kodlu Yoklama Sistemi - Frontend
Bu proje, QR kod tabanlı bir yoklama sistemi sunar ve React ile Material-UI kullanılarak geliştirilmiştir. Sistem, öğretmenlerin yoklama almasını hızlandırmak için tasarlanmış olup, öğrencilerin kolayca katılım sağladığı modern bir çözüm sunar.

🏷 Özellikler
QR Kodlu Yoklama: Her 3 saniyede yenilenen güvenli QR kodları ile öğrenci yoklaması yapılır.

Öğretmen Paneli: Öğretmenler için kullanıcı dostu ve etkili bir yönetim paneli sunar.

Öğrenci Yönetimi: Öğrenci verileri Excel dosyalarıyla kolayca içeri aktarılabilir ve dışa aktarılabilir.

Gerçek Zamanlı Timer: Yoklama süresi öğretmen tarafından belirlenebilir ve gerçek zamanlı olarak izlenebilir.

Responsive Tasarım: Mobil cihazlar da dahil olmak üzere tüm cihazlarla uyumlu tasarım.

🛠 Teknolojiler
React: Kullanıcı arayüzü geliştirme

Material-UI: Tasarım ve bileşen kütüphanesi

JWT (JSON Web Token): Öğrenci doğrulama ve güvenlik

Axios: API ile veri iletişimi

Excel: Öğrenci verisi içeri ve dışarı aktarımı için

📥 Kurulum
Projenin frontend kısmını yerel olarak çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. Bağımlılıkları Yükleme
İlk olarak, projeyi klonlayıp frontend klasörüne geçiş yapın ve gerekli bağımlılıkları yüklemek için aşağıdaki komutları çalıştırın:


cd frontend
npm install

2. Uygulamayı Başlatma
Bağımlılıklar yüklendikten sonra, uygulamayı geliştirme modunda başlatabilirsiniz:

npm run dev
Bu komut, geliştirme sunucusunu başlatacak ve genellikle http://localhost:3000 adresinde çalışmaya başlayacaktır. Tarayıcınızda bu adresi açarak uygulamanızı görüntüleyebilirsiniz.

🖥 Kullanım
QR Kodunu Görüntüleme: Öğretmen, öğrencilere QR kodunu gösterecek. Öğrenciler bu QR kodunu okutacaklar.

Yoklama Almak: Öğrenciler QR kodunu okuttuğunda, yoklama verisi backend'e gönderilecek ve öğrenci katılımı kaydedilecek.

Öğrenci Yönetimi: Öğrenci bilgilerini Excel dosyasından içeri aktarabilir ve dışa aktarabilirsiniz.

Zamanlayıcı: Öğretmen, QR kodunun geçerliliği için bir süre belirleyebilir.

🤝 Katkıda Bulunma
Projeye katkıda bulunmak isterseniz, lütfen pull request göndermeden önce fork yaparak çalışmanızı gerçekleştirin.

1. Feature Branch Oluşturma
Geliştiricilerin proje üzerinde çalışabilmesi için, öncelikle feature branch oluşturulması gerekmektedir:

git checkout -b feature/branch-name
2. Commit ve Push İşlemleri
Çalışmalarınızı tamamladıktan sonra commit ve push işlemleri gerçekleştirebilirsiniz:

git add .
git commit -m "Feature description"
git push origin feature/branch-name
3. Pull Request Gönderme
Son olarak, GitHub üzerinden pull request oluşturarak katkınızı sunabilirsiniz.
