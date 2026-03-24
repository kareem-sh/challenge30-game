import { Link } from "react-router-dom";

export default function BrandLogo({
  to,
  className = "",
  titleClassName = "",
  badge = null,
  stacked = false,
}) {
  const content = (
    <span
      className={[
        "brand-logo-shell inline-flex",
        stacked ? "brand-logo-shell--stacked flex-col text-center" : "flex-row-reverse items-center",
        className,
      ].join(" ")}
    >
      <span className={["brand-logo-title", titleClassName].join(" ")}>
        <span className="brand-logo-kicker">تحدي</span>
        <span className="brand-logo-word-wrap">
          <span aria-hidden="true" className="brand-logo-word-shadow">
            الثَّلاثين
          </span>
          <span className="brand-logo-word">الثَّلاثين</span>
        </span>
      </span>
      {badge}
    </span>
  );

  if (!to) return content;

  return <Link to={to}>{content}</Link>;
}
