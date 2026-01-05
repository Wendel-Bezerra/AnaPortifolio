import React from 'react';
import { Scale, BookOpen, Gavel, Users, Shield, Menu, X, ChevronRight, Mail, Phone, MapPin, Linkedin, Instagram, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [contactName, setContactName] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactMessage, setContactMessage] = React.useState('');
  const [contactCompany, setContactCompany] = React.useState(''); // honeypot anti-spam (campo invisível)
  const [contactStatus, setContactStatus] = React.useState<
    | { type: 'idle' }
    | { type: 'loading' }
    | { type: 'success'; message: string }
    | { type: 'error'; message: string }
  >({ type: 'idle' });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus({ type: 'loading' });

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          company: contactCompany, // honeypot
        }),
      });

      const data = (await resp.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (!resp.ok || !data?.ok) {
        setContactStatus({
          type: 'error',
          message: data?.error || 'Não foi possível enviar. Tente novamente.',
        });
        return;
      }

      setContactStatus({
        type: 'success',
        message: 'Mensagem enviada com sucesso! Você receberá um e-mail de confirmação em instantes.',
      });
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactCompany('');
    } catch {
      setContactStatus({
        type: 'error',
        message: 'Falha de conexão. Verifique sua internet e tente novamente.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-serif text-2xl text-primary tracking-tight">
                Ana Cecília &amp; José Olavo
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {['Início', 'Sobre', 'Atuação', 'Diferenciais', 'Contato'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace('í', 'i').replace('ç', 'c').replace('ã', 'a'))}
                  className="text-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider"
                >
                  {item}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('contato')}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-sm hover:bg-primary/90 transition-colors text-sm uppercase tracking-widest"
              >
                Agendar Consulta
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-muted-foreground hover:text-foreground p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
              {['Início', 'Sobre', 'Atuação', 'Diferenciais', 'Contato'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace('í', 'i').replace('ç', 'c').replace('ã', 'a'))}
                  className="block w-full text-left px-3 py-3 text-foreground hover:text-primary hover:bg-muted rounded-md text-base font-bold"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/image.png')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-primary/90"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
              Advocacia pautada na ética e na excelência técnica.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 font-light max-w-2xl leading-relaxed">
              Soluções jurídicas seguras e transparentes, focadas na prevenção de conflitos e na defesa incansável dos seus direitos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('contato')}
                className="bg-background text-foreground px-8 py-4 rounded-sm hover:bg-background/90 transition-colors font-medium uppercase tracking-widest text-base flex items-center justify-center gap-2"
              >
                Falar com Especialista
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Sobre Nós</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-foreground">Nossa Equipe</h3>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center mb-24">
            <motion.div {...fadeInUp} className="relative mb-12 lg:mb-0">
              <div className="aspect-[3/4] bg-muted rounded-sm relative overflow-hidden shadow-xl">
                 <img 
                   src="/foto-perfil.jpg" 
                   alt="Ana Cecília Batista" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary p-8 flex flex-col justify-center text-primary-foreground shadow-lg hidden md:flex">
                <span className="text-4xl font-serif mb-2">2024</span>
                <span className="text-sm tracking-wider uppercase opacity-80">Início da<br/>Trajetória</span>
              </div>
            </motion.div>
            
            <motion.div {...fadeInUp} className="lg:pl-10">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Sócia Fundadora</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-8">Ana Cecília Batista</h3>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Sou advogada graduada pela <strong>Faculdade Baiana de Direito e Gestão</strong> (2024) e pós-graduada em <strong>Processo Civil Lato Sensu pela PUC-RS</strong> (2025).
                </p>
                <p>
                  Construo minha trajetória marcada pelo rigor técnico e pelo compromisso inegociável com a ética profissional. Minha atuação é guiada pela atualização constante e pela busca incansável das melhores soluções jurídicas para cada caso, seja na esfera consultiva ou contenciosa.
                </p>
                <p>
                   Acredito que a advocacia moderna exige não apenas conhecimento profundo da lei, mas também uma visão humanizada e estratégica para antecipar problemas e garantir a segurança jurídica dos meus clientes.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-8">
                <div>
                   <span className="block text-2xl font-serif text-foreground mb-1">Civil & Trabalho</span>
                   <span className="text-sm text-muted-foreground uppercase tracking-wide">Foco de Atuação</span>
                </div>
                <div>
                   <span className="block text-2xl font-serif text-foreground mb-1">PUC-RS</span>
                   <span className="text-sm text-muted-foreground uppercase tracking-wide">Especialização</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div {...fadeInUp} className="relative mb-12 lg:mb-0">
              <div className="aspect-[3/4] bg-muted rounded-sm relative overflow-hidden shadow-xl">
                 <img 
                   src="/jose-olavo.jpg" 
                   alt="José Olavo" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary p-8 flex flex-col justify-center text-primary-foreground shadow-lg hidden md:flex">
                <span className="text-4xl font-serif mb-2">2025</span>
                <span className="text-sm tracking-wider uppercase opacity-80">Início da<br/>Trajetória</span>
              </div>
            </motion.div>
            
            <motion.div {...fadeInUp} className="lg:pl-10">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Advogado Associado</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-8">José Olavo</h3>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Sou advogado graduado pela <strong>Faculdade Baiana de Direito e Gestão</strong> (Janeiro) e pós-graduando em <strong>Processo Civil Lato Sensu pela PUC-RS</strong> (conclusão em Agosto de 2026).
                </p>
                <p>
                  Minha prática jurídica é fundamentada na excelência técnica e na transparência nas relações com cada cliente. Encaro o Direito como uma ferramenta estratégica, focada não apenas na resolução de conflitos, mas na prevenção de riscos e na viabilização de negócios.
                </p>
                <p>
                  Com uma postura proativa e atualizada, dedico-me a entregar soluções personalizadas que aliam segurança jurídica à eficiência prática, sempre pautado pela ética e pelo rigor processual.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-8">
                <div>
                   <span className="block text-2xl font-serif text-foreground mb-1">Civil & Trabalho</span>
                   <span className="text-sm text-muted-foreground uppercase tracking-wide">Foco de Atuação</span>
                </div>
                <div>
                   <span className="block text-2xl font-serif text-foreground mb-1">PUC-RS</span>
                   <span className="text-sm text-muted-foreground uppercase tracking-wide">Especialização</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section id="atuacao" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base font-bold text-muted-foreground uppercase tracking-widest mb-3">Áreas de Atuação</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-foreground">Expertise Jurídica</h3>
            <p className="mt-6 text-lg text-muted-foreground font-light">Atuação técnica e estratégica nas principais áreas do direito, com foco na resolução efetiva de demandas.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Gavel className="w-8 h-8 text-foreground" />,
                title: "Direito do Trabalho",
                text: "Atuação estratégica em demandas trabalhistas, com foco na análise preventiva de riscos e na defesa técnica em contencioso judicial. O trabalho visa garantir a segurança jurídica nas relações de trabalho."
              },
              {
                icon: <Users className="w-8 h-8 text-foreground" />,
                title: "Direito de Família",
                text: "Condução de divórcios, guarda, e pensão alimentícia com abordagem técnica e acolhedora. Foco na resolução eficiente de conflitos e proteção patrimonial, privilegiando o diálogo."
              },
              {
                icon: <BookOpen className="w-8 h-8 text-foreground" />,
                title: "Sucessões",
                text: "Assessoria em inventários e planejamentos sucessórios, garantindo a correta transmissão de bens e a preservação da harmonia familiar através de soluções jurídicas seguras."
              },
              {
                icon: <Shield className="w-8 h-8 text-foreground" />,
                title: "Direito Previdenciário",
                text: "Consultoria especializada e atuação administrativa e judicial para a concessão e revisão de benefícios. Análise minuciosa do histórico para assegurar o melhor benefício legal."
              },
              {
                icon: <Scale className="w-8 h-8 text-foreground" />,
                title: "Direito do Consumidor",
                text: "Defesa técnica em litígios de consumo, visando o reequilíbrio contratual e a reparação de danos, sempre com base na análise criteriosa do Código de Defesa do Consumidor."
              },
              {
                icon: <FileText className="w-8 h-8 text-foreground" />,
                title: "Direito Processual Civil",
                text: "Atuação técnica em procedimentos judiciais, recursos e execução de sentenças. Foco na celeridade processual e na obtenção de resultados efetivos através do domínio das normas processuais."
              }
            ].map((area, index) => (
              <motion.div 
                key={index}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-border/50"
              >
                <div className="flex items-center gap-5 mb-5">
                  <div className="p-3 bg-muted rounded-2xl text-foreground">
                    {React.cloneElement(area.icon as React.ReactElement, { className: "w-6 h-6" })}
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">{area.title}</h4>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed font-light pl-1">{area.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section id="diferenciais" className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                title: "Atendimento Personalizado",
                desc: "Estratégias desenhadas sob medida para suas necessidades específicas."
              },
              {
                title: "Transparência Processual",
                desc: "Informação clara e constante sobre o andamento e expectativas reais do caso."
              },
              {
                title: "Rigor Técnico",
                desc: "Defesa baseada em estudo aprofundado da doutrina e jurisprudência."
              },
              {
                title: "Sigilo Absoluto",
                desc: "Confidencialidade rigorosa em todas as etapas do atendimento."
              }
            ].map((diff, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center md:text-left"
              >
                <h4 className="text-lg font-bold mb-3">{diff.title}</h4>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{diff.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Fale Conosco</h2>
              <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-8">Entre em Contato</h3>
              <p className="text-muted-foreground mb-10 text-lg">
                Agende uma consulta para analisarmos o seu caso com a atenção que ele merece.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-foreground mt-1 mr-4" />
                  <div>
                    <h5 className="font-medium text-foreground">Email</h5>
                    <p className="text-muted-foreground">Anacecilia.batistacordeiro@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-foreground mt-1 mr-4" />
                  <div>
                    <h5 className="font-medium text-foreground">Telefone / WhatsApp</h5>
                    <p className="text-muted-foreground">(71) 98783-0651</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-foreground mt-1 mr-4" />
                  <div>
                    <h5 className="font-medium text-foreground">Escritório</h5>
                    <p className="text-muted-foreground">Salvador, Bahia</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex space-x-4">
                <a href="#" className="p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors text-foreground">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors text-foreground">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            <div className="bg-card p-8 md:p-10 rounded-sm border border-border">
              <form className="space-y-6" onSubmit={submitContact}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    value={contactName}
                    onChange={(ev) => setContactName(ev.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none rounded-sm"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    value={contactEmail}
                    onChange={(ev) => setContactEmail(ev.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none rounded-sm"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Mensagem</label>
                  <textarea
                    id="message"
                    rows={4}
                    value={contactMessage}
                    onChange={(ev) => setContactMessage(ev.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none rounded-sm resize-none"
                    placeholder="Descreva brevemente sua necessidade..."
                  />
                </div>

                {/* Honeypot anti-spam (não mostrar) */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={contactCompany}
                  onChange={(ev) => setContactCompany(ev.target.value)}
                  className="hidden"
                />

                {contactStatus.type === 'success' && (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-sm p-3">
                    {contactStatus.message}
                  </div>
                )}
                {contactStatus.type === 'error' && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm p-3">
                    {contactStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactStatus.type === 'loading'}
                  className="w-full bg-primary text-primary-foreground px-6 py-4 font-medium uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {contactStatus.type === 'loading' ? 'Enviando…' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-serif text-xl text-foreground tracking-tight block">Ana Cecília &amp; José Olavo</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Advocacia & Consultoria</span>
          </div>
          <div className="text-muted-foreground text-sm text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
            <p className="mt-1">Site desenvolvido em conformidade com o Provimento 205/2021 da OAB.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;