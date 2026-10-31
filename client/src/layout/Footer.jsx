const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200/80 mt-auto shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-gray-500">
          <div className="copyright-info text-center sm:text-left">
            <span>
              কপিরাইট © ২০০৯ -{" "}
              {new Date().getFullYear().toLocaleString("bn-BD", {
                useGrouping: false,
              })}{" "}
              রুবেল অটো। সর্বস্বত্ব সংরক্ষিত।
            </span>
          </div>

          <div className="footer-menu text-center sm:text-right">
            <span>ডেভেলপ করেছেন{" - "}</span>
            <a
              href="https://www.wapborhan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              মোঃ বোরহান উদ্দিন
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
