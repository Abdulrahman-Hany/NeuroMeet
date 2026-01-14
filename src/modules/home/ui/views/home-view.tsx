"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Database, Smartphone, TrendingUp } from "lucide-react";

export const HomeView = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#061A15] via-[#132621] to-[#061A15]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#E0F89D]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#132621]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#E0F89D]/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="relative z-10 flex flex-col gap-32 p-8 max-w-7xl mx-auto">

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-8 pt-20 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#132621]/10 border border-[#061A15]/20 backdrop-blur-sm mb-4 animate-fade-in">
            <Zap className="w-4 h-4 text-[#c7c3c4]" />
            <span className="text-sm text-[#c7c3c4] font-medium">Powered by Advanced Analytics</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E0F89D] via-[#475853] to-[#87b0a6] animate-fade-in-up">
            Manage Your Data
            <br />
            <span className="text-[#c7c3c4]">Smarter & Faster</span>
          </h1>
          
          <p className="text-[#c7c3c4]/70 max-w-2xl text-lg md:text-xl leading-relaxed animate-fade-in-up delay-200">
            A cutting-edge dashboard solution that empowers you to manage, analyze,
            and visualize your data with unprecedented ease and lightning-fast performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-up delay-300">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#061A15] to-[#132621] hover:from-[#132621] hover:to-[#E0F89D] text-[#c7c3c4] shadow-lg shadow-[#E0F89D]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#E0F89D]/60 group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#132621] text-[#191919] shadow-lg shadow-[#E0F89D]/50 hover:bg-[#fffff]/50 hover:border-[#E0F89D]/50 transition-all duration-300 backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-400">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Optimized components and intelligent data handling deliver unmatched speed and responsiveness.",
              gradient: "from-[#E0F89D]/20 to-[#132621]/20",
              iconColor: "text-[#c7c3c4]",
              borderColor: "border-[#132621]/30"
            },
            {
              icon: Database,
              title: "Powerful Tables",
              description: "Enterprise-grade data tables with advanced sorting, filtering, and seamless pagination.",
              gradient: "from-[#132621]/20 to-[#061A15]/20",
              iconColor: "text-[#c7c3c4]",
              borderColor: "border-[#061A15]/30"
            },
            {
              icon: Smartphone,
              title: "Fully Responsive",
              description: "Flawless experience across all devices - desktop, tablet, and mobile platforms.",
              gradient: "from-[#061A15]/20 to-[#E0F89D]/20",
              iconColor: "text-[#c7c3c4]",
              borderColor: "border-[#132621]/30"
            }
          ].map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-[#061A15]/50 border-[#132621]/50 backdrop-blur-sm hover:border-[#132621] transition-all duration-500 hover:shadow-2xl hover:shadow-[#E0F89D]/20 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardContent className="relative p-8 space-y-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                
                <h3 className="font-bold text-xl text-[#c7c3c4] group-hover:text-[#8b8b8b] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-[#c7c3c4]/70 leading-relaxed group-hover:text-[#c7c3c4] transition-colors">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Stats Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#061A15]/10 via-[#132621]/10 to-[#E0F89D]/10 rounded-3xl blur-xl" />
          
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 p-12 rounded-3xl border border-[#132621]/50 bg-[#061A15]/30 backdrop-blur-md animate-fade-in-up delay-500">
            {[
              { number: "10k+", label: "Active Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "500+", label: "Companies" },
              { number: "24/7", label: "Support"}
            ].map((stat, index) => (
              <div 
                key={index}
                className="group text-center space-y-2 hover:scale-110 transition-transform duration-300"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E0F89D] to-[#132621] group-hover:from-[#E0F89D] group-hover:to-[#061A15] transition-all">
                  {stat.number}
                </h2>
                <p className="text-[#c7c3c4]/70 font-medium group-hover:text-[#c7c3c4] transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative flex flex-col items-center gap-6 pb-20 animate-fade-in-up delay-600">
          <div className="absolute inset-0 bg-gradient-to-r from-[#061A15] via-[#132621] to-[#E0F89D] rounded-3xl blur-2xl opacity-20" />
          
          <div className="relative text-center space-y-6 p-12 rounded-3xl border-2 border-[#132621]/50 bg-[#061A15]/40 backdrop-blur-md max-w-3xl">
            <TrendingUp className="w-16 h-16 mx-auto text-[#c7c3c4] animate-pulse" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#c7c3c4]">
              Ready to Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F89D] to-[#132621]"> Workflow?</span>
            </h2>
            
            <p className="text-[#c7c3c4]/70 text-lg">
              Join thousands of teams already using our platform to unlock their data's full potential.
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#061A15] via-[#132621] to-[#E0F89D] hover:from-[#132621] hover:via-[#061A15] hover:to-[#E0F89D] text-[#c7c3c4]  shadow-2xl shadow-[#E0F89D]/50 transition-all duration-300 hover:scale-105 hover:shadow-[#E0F89D]/70 text-lg px-8 py-5 group bg-[length:200%_auto] animate-gradient"
            >
              Create Your First Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
        .animate-gradient { animation: gradient 3s ease infinite; }
      `}</style>
    </div>
  );
};
