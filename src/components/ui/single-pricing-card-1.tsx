'use client';
import React from 'react';
import { PlusIcon, ShieldCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './border-trail';

export function Pricing() {
	return (
		<section className="relative overflow-hidden py-24">
			<div id="pricing" className="mx-auto w-full max-w-6xl space-y-5 px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
					viewport={{ once: true }}
					className="mx-auto max-w-xl space-y-5"
				>
					<div className="flex justify-center">
						<div className="rounded-lg border border-white/10 px-4 py-1 font-mono text-white/60 text-sm">Plans</div>
					</div>
					<h2 className="mt-5 text-center text-2xl font-bold tracking-tighter text-white md:text-3xl lg:text-4xl">
						Choose the Right Plan
					</h2>
					<p className="mt-5 text-center text-sm text-white/40 md:text-base">
						Three plans. Separate image & video credits. Redeem a coupon to activate instantly.
					</p>
				</motion.div>

				<div className="relative">
					<div
						className={cn(
							'z--10 pointer-events-none absolute inset-0 size-full',
							'bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]',
							'bg-[size:32px_32px]',
							'[mask-image:radial-gradient(ellipse_at_center,black_10%,transparent)]',
						)}
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						viewport={{ once: true }}
						className="mx-auto w-full max-w-4xl space-y-2"
					>
						<div className="grid md:grid-cols-3 relative border border-white/10 bg-white/[0.02] p-4 rounded-xl">
							<PlusIcon className="absolute -top-3 -left-3 size-5.5 text-white/20" />
							<PlusIcon className="absolute -top-3 -right-3 size-5.5 text-white/20" />
							<PlusIcon className="absolute -bottom-3 -left-3 size-5.5 text-white/20" />
							<PlusIcon className="absolute -right-3 -bottom-3 size-5.5 text-white/20" />

							{/* Basic */}
							<div className="w-full px-4 pt-5 pb-4">
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold text-white">Basic</h3>
										<Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Starter</Badge>
									</div>
									<p className="text-white/40 text-sm">3,500 img · 2,000 vid credits</p>
								</div>
								<div className="mt-8 space-y-4">
									<div className="text-white/40 flex items-end gap-0.5 text-xl">
										<span>$</span>
										<span className="text-white -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">9</span>
										<span>/month</span>
									</div>
									<Button className="w-full bg-white/10 text-white border-white/10 hover:bg-white/20" variant="outline" asChild>
										<a href="/redeem">Get Basic</a>
									</Button>
								</div>
							</div>

							{/* Pro */}
							<div className="relative w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 pt-5 pb-4">
								<BorderTrail
									className="bg-purple-500"
									style={{
										boxShadow: '0px 0px 60px 30px rgba(168, 85, 247, 0.4), 0 0 100px 60px rgba(168, 85, 247, 0.2), 0 0 140px 90px rgba(0, 0, 0, 0.3)',
									}}
									size={100}
								/>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold text-white">Pro</h3>
										<Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Popular</Badge>
									</div>
									<p className="text-white/40 text-sm">8,000 img · 4,000 vid credits</p>
								</div>
								<div className="mt-8 space-y-4">
									<div className="text-white/40 flex items-end text-xl">
										<span>$</span>
										<span className="text-white -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">19</span>
										<span>/month</span>
									</div>
									<Button className="w-full bg-white text-black hover:bg-gray-200" asChild>
										<a href="/redeem">Get Pro</a>
									</Button>
								</div>
							</div>

							{/* Ultimate */}
							<div className="w-full px-4 pt-5 pb-4">
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold text-white">Ultimate</h3>
										<Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">Max</Badge>
									</div>
									<p className="text-white/40 text-sm">50,000 img · 25,000 vid credits</p>
								</div>
								<div className="mt-8 space-y-4">
									<div className="text-white/40 flex items-end gap-0.5 text-xl">
										<span>$</span>
										<span className="text-white -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">49</span>
										<span>/month</span>
									</div>
									<Button className="w-full bg-white/10 text-white border-white/10 hover:bg-white/20" variant="outline" asChild>
										<a href="/redeem">Get Ultimate</a>
									</Button>
								</div>
							</div>
						</div>

						<div className="text-white/40 flex items-center justify-center gap-x-2 text-sm">
							<ShieldCheckIcon className="size-4" />
							<span>Redeem a coupon to activate any plan instantly</span>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
