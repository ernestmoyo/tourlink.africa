import { siteConfig } from '@/data/site';
import { formatPhoneForWhatsApp } from '@/lib/utils';

export function OfficeLocations() {
  return (
    <div className="space-y-8">
      {/* Office Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {siteConfig.offices.map((office) => (
          <div
            key={office.city}
            className="relative rounded-xl bg-white border border-savanna p-5 hover:shadow-card transition-shadow duration-200"
          >
            {/* HQ Badge */}
            {office.isHQ && (
              <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy text-white">
                Headquarters
              </span>
            )}

            <h3 className="text-lg font-bold text-charcoal">
              {office.city}
            </h3>
            <p className="text-sm text-slate mt-0.5">{office.country}</p>

            <address className="text-sm text-slate not-italic mt-3 leading-relaxed">
              {office.address}
            </address>

            <div className="mt-3 space-y-1">
              {office.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sm text-navy hover:text-navy-dark transition-colors duration-200"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span>{phone}</span>
                </a>
              ))}

              {/* WhatsApp link for HQ */}
              {office.isHQ && office.phones[0] && (
                <a
                  href={`https://wa.me/${formatPhoneForWhatsApp(office.phones[0])}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-olive hover:text-olive-light transition-colors duration-200"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              )}
            </div>

            {/* Map Placeholder */}
            <div className="mt-4 rounded-lg bg-sand border border-savanna flex items-center justify-center h-24 text-sm text-slate">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Map
            </div>
          </div>
        ))}
      </div>

      {/* Operating Hours */}
      <div className="rounded-xl bg-sand border border-savanna p-5">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">
            Operating Hours
          </h3>
        </div>
        <p className="text-sm text-slate">{siteConfig.operatingHours}</p>
      </div>

      {/* Response Promise */}
      <div className="rounded-xl bg-navy/5 border border-navy/10 p-5 text-center">
        <svg className="w-8 h-8 text-navy mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
        <p className="text-sm font-semibold text-navy">
          We respond to all inquiries within 24 hours
        </p>
      </div>
    </div>
  );
}
