const Footer = () => {
  return (
    <div className="foot py-3 text-white   bg-[#198754]">
      <div className="mx-auto w-full px-10">
        <div className="flex justify-between">
          <div className="col-lg-6 col-md-12">
            <div className="copyright-info">
              <span>
                কপিরাইট © ২০০৯ -{" "}
                {new Date().getFullYear().toLocaleString("bn-BD", {
                  useGrouping: false,
                })}{" "}
                রুবেল অটো। সর্বস্বত্ব সংরক্ষিত।
              </span>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="footer-menu text-right">
              ডেভেলপ করেছেন{" - "}
              <a
                href="https://www.wapborhan.com"
                target="__BLANK"
                className="text-black font-bold shadow-md"
              >
                মোঃ বোরহান উদ্দিন
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
