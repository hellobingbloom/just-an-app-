import { ArrowLeft, ExternalLink, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import SEO from "@/components/SEO";

const downloadOptions = [
  {
    title: "WhatsApp Channel",
    description: "Follow the channel for the latest APK and updates.",
    buttonText: "Get APK on WhatsApp",
    href: "https://whatsapp.com/channel/0029VbD2CdHEwEjtJ5Utbo2n",
    Icon: MessageCircle,
    iconClass: "bg-[#25D366]/15 text-[#25D366]",
  },
  {
    title: "Telegram",
    description: "Join us on Telegram for app releases and news.",
    buttonText: "Get APK on Telegram",
    href: "https://t.me/bingbloom",
    Icon: Send,
    iconClass: "bg-sky-500/15 text-sky-400",
  },
  {
    title: "Request APK via WhatsApp",
    description: "Message us directly and we’ll help you get the APK.",
    buttonText: "Text Us for the APK",
    href: "https://wa.me/254733541119?text=Hi%2C%20I%20would%20like%20to%20get%20the%20BingBloom%20APK",
    Icon: MessageCircle,
    iconClass: "bg-[#25D366]/15 text-[#25D366]",
    detail: "+254 733 541 119",
  },
];

const DownloadOptionsPage = () => (
  <AppLayout>
    <SEO
      title="Get the BingBloom App"
      description="Join our community to get the latest APK, installation instructions, and app updates."
    />

    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-2xl shadow-black/20 sm:p-8">
        <div className="mb-5 flex justify-center">
          <img
            src="/logo-compact.png"
            alt="BingBloom app icon"
            className="h-16 w-16 rounded-2xl shadow-lg shadow-primary/20 sm:h-20 sm:w-20"
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Get the BingBloom App
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Join our community to get the latest APK, installation instructions, and app updates. Choose your preferred option below.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          {downloadOptions.map(({ title, description, buttonText, href, Icon, iconClass, detail }) => (
            <article key={title} className="rounded-2xl border border-border/70 bg-background/60 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${iconClass}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{description}</p>
                  {detail && <p className="mt-1 text-xs font-medium text-muted-foreground">{detail}</p>}
                </div>
              </div>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {buttonText}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
          Having trouble installing the app?{" "}
          <Link to="/contact" className="font-medium text-primary hover:underline">
            Contact our support team
          </Link>{" "}
          and we’ll help you.
        </p>

        <div className="mt-6 border-t border-border/70 pt-5 text-center">
          <Link
            to="/home"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to BingBloom
          </Link>
        </div>
      </section>
    </div>
  </AppLayout>
);

export default DownloadOptionsPage;
