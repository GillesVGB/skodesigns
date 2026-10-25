import { useId } from "react";

/**
 * Device presentation built from vector geometry. Both displays use the supplied
 * artwork directly, so the S symbol and wordmark retain their original shape.
 */
export default function DeviceMockups({ label }: { label: string }) {
  const id = `sko-devices-${useId().replace(/:/g, "")}`;
  const paint = (name: string) => `url(#${id}-${name})`;

  return (
    <svg
      className="device-mockups"
      viewBox="0 0 860 600"
      width="860"
      height="600"
      fill="none"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient
          id={`${id}-lid-edge`}
          x1="0"
          y1="0"
          x2="410"
          y2="290"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D4D7DB" />
          <stop offset="0.08" stopColor="#73767C" />
          <stop offset="0.46" stopColor="#17191C" />
          <stop offset="0.93" stopColor="#63666A" />
          <stop offset="1" stopColor="#D6D8DC" />
        </linearGradient>
        <linearGradient
          id={`${id}-aluminium`}
          x1="170"
          y1="0"
          x2="248"
          y2="177"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D7DADF" />
          <stop offset="0.4" stopColor="#AEB2B9" />
          <stop offset="0.72" stopColor="#D5D7DC" />
          <stop offset="1" stopColor="#F0F1F3" />
        </linearGradient>
        <linearGradient
          id={`${id}-front-edge`}
          x1="205"
          y1="155"
          x2="205"
          y2="177"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A6A9AF" />
          <stop offset="0.4" stopColor="#F3F4F6" />
          <stop offset="0.65" stopColor="#B5B8BD" />
          <stop offset="1" stopColor="#72767C" />
        </linearGradient>
        <linearGradient
          id={`${id}-key`}
          x1="0"
          y1="0"
          x2="0"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#45484E" />
          <stop offset="1" stopColor="#24272D" />
        </linearGradient>
        <linearGradient
          id={`${id}-phone-edge`}
          x1="0"
          y1="110"
          x2="161"
          y2="176"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#969A9D" />
          <stop offset="0.06" stopColor="#323538" />
          <stop offset="0.18" stopColor="#53575A" />
          <stop offset="0.88" stopColor="#171A1D" />
          <stop offset="1" stopColor="#929699" />
        </linearGradient>
        <linearGradient
          id={`${id}-phone-glass`}
          x1="14"
          y1="0"
          x2="142"
          y2="330"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="0.7" stopColor="#FDFDFE" />
          <stop offset="1" stopColor="#F4F5F8" />
        </linearGradient>
        <filter
          id={`${id}-shadow`}
          x="-30%"
          y="-25%"
          width="170%"
          height="185%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="25"
            stdDeviation="22"
            floodColor="#455369"
            floodOpacity="0.19"
          />
        </filter>
        <filter
          id={`${id}-contact-shadow`}
          x="-40%"
          y="-100%"
          width="180%"
          height="300%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      <g aria-hidden="true">
        <ellipse
          cx="581"
          cy="527"
          rx="188"
          ry="20"
          fill="#425471"
          opacity="0.11"
          filter={paint("contact-shadow")}
        />
        <ellipse
          cx="232"
          cy="542"
          rx="76"
          ry="15"
          fill="#425471"
          opacity="0.1"
          filter={paint("contact-shadow")}
        />

        <g filter={paint("shadow")}>
          {/* The screen and keyboard use two planes sharing the same hinge. */}
          <g transform="matrix(.87 -.23 .25 .91 403 135)">
            <rect
              x="-7"
              y="-8"
              width="424"
              height="299"
              rx="11"
              fill={paint("lid-edge")}
            />
            <rect
              x="-3.5"
              y="-5"
              width="417"
              height="292"
              rx="8"
              fill="#151719"
              stroke="#090A0B"
              strokeWidth="1.2"
            />
            <rect
              x="2"
              y="1"
              width="406"
              height="280"
              rx="4.5"
              fill="#FFFFFF"
            />
            <image
              href="/assets/sko-logo-transparent.png"
              x="52"
              y="86"
              width="306"
              height="116"
              preserveAspectRatio="xMidYMid meet"
            />
            <path
              d="M178 0H232V6Q232 9 229 9H181Q178 9 178 6Z"
              fill="#151719"
            />
            <circle cx="205" cy="3.2" r="1.2" fill="#29343D" />
            <path d="M0 284H411" stroke="#65696F" strokeWidth="2" />
            <path d="M5 -5H405" stroke="#E3E5E8" strokeOpacity="0.28" />
          </g>

          <g transform="matrix(.87 -.23 -.55 .85 474 394)">
            <path
              d="M0 151H410V165Q409 174 399 175H13Q3 174 0 167Z"
              fill={paint("front-edge")}
              stroke="#969AA1"
              strokeWidth="0.8"
            />
            <path
              d="M0 0H410V156Q410 164 400 165H10Q0 164 0 156Z"
              fill={paint("aluminium")}
              stroke="#C0C3C9"
              strokeWidth="0.8"
            />
            <path d="M1 1H409" stroke="#F7F8FA" strokeWidth="1.4" />
            <rect
              x="18"
              y="15"
              width="374"
              height="94"
              rx="5"
              fill="#6C7077"
              stroke="#A4A7AE"
              strokeWidth="0.9"
            />

            {Array.from({ length: 15 }, (_, column) => (
              <rect
                key={`function-${column}`}
                x={22 + column * 24.4}
                y="19"
                width="21"
                height="7"
                rx="1.2"
                fill="#34373D"
                stroke="#8B8E95"
                strokeWidth="0.45"
              />
            ))}
            {Array.from({ length: 4 }, (_, row) =>
              Array.from({ length: 14 }, (_, column) => (
                <g
                  key={`key-${row}-${column}`}
                  transform={`translate(${22 + column * 26.1} ${29 + row * 15.2})`}
                >
                  <rect
                    width="23"
                    height="12"
                    rx="1.5"
                    fill={paint("key")}
                    stroke="#92959B"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M5 3.6H7.5"
                    stroke="#D4D7DD"
                    strokeWidth="0.65"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                </g>
              )),
            )}
            <g fill="#30333A" stroke="#93969C" strokeWidth="0.5">
              <rect x="22" y="91" width="31" height="12" rx="1.5" />
              <rect x="56" y="91" width="27" height="12" rx="1.5" />
              <rect x="86" y="91" width="28" height="12" rx="1.5" />
              <rect x="117" y="91" width="159" height="12" rx="1.5" />
              <rect x="279" y="91" width="28" height="12" rx="1.5" />
              <rect x="310" y="91" width="27" height="12" rx="1.5" />
              <rect x="340" y="91" width="27" height="12" rx="1.5" />
              <rect x="370" y="91" width="18" height="12" rx="1.5" />
            </g>
            <rect
              x="130"
              y="118"
              width="153"
              height="35"
              rx="4"
              fill="#C5C8CE"
              fillOpacity="0.42"
              stroke="#92969E"
              strokeWidth="0.8"
            />
            <path d="M134 119H279" stroke="#E9EAED" strokeWidth="0.7" />
            <path d="M177 164H233L229 168H181Z" fill="#8F939A" opacity="0.7" />
            <path
              d="M8 168H402"
              stroke="#F5F6F8"
              strokeWidth="0.8"
              opacity="0.8"
            />
          </g>
        </g>

        <g
          transform="matrix(.98 .025 .24 .98 105 205)"
          filter={paint("shadow")}
        >
          <rect x="-6" y="1" width="166" height="334" rx="27" fill="#45494D" />
          <rect
            x="-2"
            y="-3"
            width="162"
            height="335"
            rx="26"
            fill={paint("phone-edge")}
            stroke="#8D9196"
            strokeWidth="0.75"
          />
          <rect x="3" y="1" width="153" height="327" rx="23" fill="#111315" />
          <rect
            x="8"
            y="6"
            width="143"
            height="317"
            rx="19"
            fill={paint("phone-glass")}
          />
          <path d="M23 7H132" stroke="#FFFFFF" strokeOpacity="0.8" />

          <text
            x="20"
            y="22"
            fontFamily="Arial, sans-serif"
            fontSize="6.6"
            fontWeight="700"
            fill="#1B1D21"
          >
            9:41
          </text>
          <rect x="59" y="12" width="43" height="11" rx="5.5" fill="#111315" />
          <circle cx="95" cy="17.4" r="2.1" fill="#20282F" />
          <path
            d="M116 20V17M119 20V15M122 20V13"
            stroke="#202329"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <rect
            x="129"
            y="14"
            width="9"
            height="5"
            rx="1.2"
            stroke="#272B31"
            strokeWidth="0.7"
          />
          <rect
            x="130.2"
            y="15.2"
            width="6.6"
            height="2.6"
            rx="0.4"
            fill="#272B31"
          />
          <path d="M139 15.5V17.5" stroke="#272B31" strokeWidth="0.7" />

          <svg
            x="24"
            y="114"
            width="111"
            height="114"
            viewBox="120 40 740 690"
            preserveAspectRatio="xMidYMid meet"
          >
            <image
              href="/assets/sko-logo-transparent.png"
              width="2083"
              height="755"
            />
          </svg>

          <rect x="58" y="311" width="45" height="3" rx="1.5" fill="#23262C" />
          <path
            d="M-3 57V79M-3 91V113M160 78V112"
            stroke="#70757A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M68 331H92"
            stroke="#121518"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <circle cx="59" cy="330.7" r="1" fill="#16191C" />
          <circle cx="103" cy="330.7" r="1" fill="#16191C" />
          <path
            d="M4 28V296"
            stroke="#E1E4E7"
            strokeOpacity="0.22"
            strokeWidth="0.7"
          />
        </g>
      </g>
    </svg>
  );
}
