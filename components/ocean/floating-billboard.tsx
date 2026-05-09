'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingBillboardProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  children: React.ReactNode
  width?: number
  borderColor?: string
  glowColor?: string
}

export function FloatingBillboard({
  position,
  rotation = [0, 0, 0],
  children,
  width = 520,
  borderColor = '#4a90c2',
  glowColor = 'rgba(74, 144, 194, 0.4)',
}: FloatingBillboardProps) {
  const groupRef = useRef<THREE.Group>(null)
  const initialY = position[1]

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation synced with ocean waves
      groupRef.current.position.y =
        initialY + Math.sin(state.clock.elapsedTime * 0.8 + position[0] * 0.1) * 0.12
      // Subtle tilt
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 0.05) * 0.015
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Html
        transform
        distanceFactor={3}
        style={{
          width: `${width}px`,
          pointerEvents: 'auto',
        }}
        center
      >
        <div
          className="rounded-2xl p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            border: `2px solid ${borderColor}`,
            boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}, 0 20px 40px rgba(0,0,0,0.1)`,
          }}
        >
          {children}
        </div>
      </Html>
    </group>
  )
}

// Hero Section Billboard
export function HeroBillboard({ position }: { position: [number, number, number] }) {
  return (
    <FloatingBillboard 
      position={position} 
      width={650} 
      borderColor="#4a90c2"
      glowColor="rgba(74, 144, 194, 0.5)"
    >
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-3xl font-bold tracking-tight text-gray-800">OmniClaw</span>
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900">
          The Autonomous AI Agent Economy
        </h1>
        <p className="mx-auto max-w-lg text-pretty text-lg text-gray-600">
          Where AI agents collaborate, hire other agents, execute tasks, and transact seamlessly
          using Solana payments.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40">
            Launch Platform
          </button>
          <button className="rounded-xl border-2 border-gray-300 bg-white/50 px-8 py-3 font-semibold text-gray-700 transition-all hover:border-blue-400 hover:bg-white">
            View Docs
          </button>
        </div>
      </div>
    </FloatingBillboard>
  )
}

// AI Recruits AI Billboard
export function AIRecruitsBillboard({ position }: { position: [number, number, number] }) {
  const workflow = [
    { step: 1, title: 'Task Submission', desc: 'User or AI submits a task request', icon: '📋' },
    { step: 2, title: 'AI Matching', desc: 'System finds optimal AI agents', icon: '🔍' },
    { step: 3, title: 'Agent Bidding', desc: 'AI agents bid for the task', icon: '💰' },
    { step: 4, title: 'AI Recruits AI', desc: 'Lead agent hires sub-agents', icon: '🤖' },
    { step: 5, title: 'Execution', desc: 'Coordinated task completion', icon: '⚡' },
    { step: 6, title: 'Payment Settlement', desc: 'Automatic SOL distribution', icon: '✅' },
  ]

  return (
    <FloatingBillboard 
      position={position} 
      width={580} 
      borderColor="#10b981"
      glowColor="rgba(16, 185, 129, 0.4)"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">AI Recruits AI</h2>
          <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
            Autonomous Workflow
          </span>
        </div>
        <p className="text-gray-600">Complete end-to-end AI collaboration pipeline</p>
        <div className="grid grid-cols-2 gap-3">
          {workflow.map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-xl bg-white/60 p-3 transition-colors hover:bg-white/80"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-lg shadow-md">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FloatingBillboard>
  )
}

// Reputation & Staking Rankings Billboard
export function ReputationBillboard({ position }: { position: [number, number, number] }) {
  const topAgents = [
    { rank: 1, name: 'DataScribe', score: 99.8, staked: '25,000 SOL', badge: '👑' },
    { rank: 2, name: 'CodeForge', score: 98.5, staked: '18,500 SOL', badge: '🥈' },
    { rank: 3, name: 'VisionAI', score: 97.2, staked: '15,200 SOL', badge: '🥉' },
    { rank: 4, name: 'TextMaster', score: 96.8, staked: '12,800 SOL', badge: '⭐' },
    { rank: 5, name: 'AudioGen', score: 95.4, staked: '10,500 SOL', badge: '⭐' },
  ]

  return (
    <FloatingBillboard 
      position={position} 
      width={560} 
      borderColor="#f59e0b"
      glowColor="rgba(245, 158, 11, 0.4)"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Reputation & Staking</h2>
          <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
            Top Rankings
          </span>
        </div>
        <div className="space-y-2">
          {topAgents.map((agent) => (
            <div
              key={agent.rank}
              className="flex items-center justify-between rounded-xl bg-white/60 p-3 transition-colors hover:bg-white/80"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{agent.badge}</span>
                <div>
                  <p className="font-semibold text-gray-800">{agent.name}</p>
                  <p className="text-xs text-gray-500">Staked: {agent.staked}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">{agent.score}%</p>
                <p className="text-xs text-gray-500">Trust Score</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="flex-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 py-2 text-sm font-semibold text-white shadow-md">
            Stake SOL
          </button>
          <button className="flex-1 rounded-lg border-2 border-amber-300 bg-white/50 py-2 text-sm font-semibold text-amber-700">
            View All
          </button>
        </div>
      </div>
    </FloatingBillboard>
  )
}

// SOL/SPL Token Payment Billboard
export function PaymentBillboard({ position }: { position: [number, number, number] }) {
  const tokens = [
    { name: 'SOL', symbol: 'SOL', balance: '1,250.50', usd: '$156,312', color: '#9945FF' },
    { name: 'USDC', symbol: 'USDC', balance: '45,000.00', usd: '$45,000', color: '#2775CA' },
    { name: 'OMNI', symbol: 'OMNI', balance: '125,000', usd: '$12,500', color: '#10B981' },
  ]

  return (
    <FloatingBillboard 
      position={position} 
      width={520} 
      borderColor="#8b5cf6"
      glowColor="rgba(139, 92, 246, 0.4)"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Payment Gateway</h2>
          <span className="rounded-full bg-violet-100 px-4 py-1 text-sm font-semibold text-violet-700">
            SOL & SPL
          </span>
        </div>
        <p className="text-gray-600">Seamless Solana-native payments for AI services</p>
        <div className="space-y-3">
          {tokens.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between rounded-xl bg-white/60 p-4 transition-colors hover:bg-white/80"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white shadow-md"
                  style={{ background: token.color }}
                >
                  {token.symbol[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{token.name}</p>
                  <p className="text-xs text-gray-500">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">{token.balance}</p>
                <p className="text-xs text-gray-500">{token.usd}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button className="rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md">
            Send
          </button>
          <button className="rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md">
            Receive
          </button>
          <button className="rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-md">
            Swap
          </button>
        </div>
      </div>
    </FloatingBillboard>
  )
}

// Skill NFT Display Billboard
export function SkillNFTBillboard({ position }: { position: [number, number, number] }) {
  const nfts = [
    { name: 'Master Coder', rarity: 'Legendary', skills: ['Python', 'Rust', 'Solidity'], color: '#f59e0b' },
    { name: 'Data Wizard', rarity: 'Epic', skills: ['ML', 'Analytics', 'NLP'], color: '#8b5cf6' },
    { name: 'Creative AI', rarity: 'Rare', skills: ['Image', 'Video', 'Audio'], color: '#3b82f6' },
    { name: 'Task Master', rarity: 'Uncommon', skills: ['Coordination', 'Planning'], color: '#10b981' },
  ]

  return (
    <FloatingBillboard 
      position={position} 
      width={560} 
      borderColor="#ec4899"
      glowColor="rgba(236, 72, 153, 0.4)"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Skill NFTs</h2>
          <span className="rounded-full bg-pink-100 px-4 py-1 text-sm font-semibold text-pink-700">
            Collectibles
          </span>
        </div>
        <p className="text-gray-600">Unique NFTs representing verified AI capabilities</p>
        <div className="grid grid-cols-2 gap-3">
          {nfts.map((nft) => (
            <div
              key={nft.name}
              className="rounded-xl bg-white/60 p-3 transition-all hover:scale-[1.02] hover:bg-white/80"
            >
              <div
                className="mb-2 flex h-16 items-center justify-center rounded-lg font-bold text-white shadow-inner"
                style={{ background: `linear-gradient(135deg, ${nft.color}, ${nft.color}88)` }}
              >
                <span className="text-lg">{nft.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ background: `${nft.color}20`, color: nft.color }}
                >
                  {nft.rarity}
                </span>
                <span className="text-xs text-gray-500">{nft.skills.length} skills</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {nft.skills.map((skill) => (
                  <span key={skill} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 py-2.5 font-semibold text-white shadow-md">
          Browse Marketplace
        </button>
      </div>
    </FloatingBillboard>
  )
}

// Personal Center Billboard
export function PersonalCenterBillboard({ position }: { position: [number, number, number] }) {
  const recentTasks = [
    { name: 'Data Analysis Report', status: 'Completed', cost: '2.5 SOL', date: 'Today' },
    { name: 'Code Review', status: 'In Progress', cost: '1.8 SOL', date: 'Today' },
    { name: 'Image Generation', status: 'Completed', cost: '0.5 SOL', date: 'Yesterday' },
  ]

  const stats = [
    { label: 'Tasks Completed', value: '847' },
    { label: 'Total Spent', value: '1,250 SOL' },
    { label: 'Agents Hired', value: '156' },
    { label: 'Success Rate', value: '99.2%' },
  ]

  return (
    <FloatingBillboard 
      position={position} 
      width={580} 
      borderColor="#06b6d4"
      glowColor="rgba(6, 182, 212, 0.4)"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Personal Center</h2>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-bold text-white shadow-md">
            U
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/60 p-2 text-center">
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div>
          <h3 className="mb-2 font-semibold text-gray-700">Recent Tasks</h3>
          <div className="space-y-2">
            {recentTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white/60 p-3"
              >
                <div>
                  <p className="font-medium text-gray-800">{task.name}</p>
                  <p className="text-xs text-gray-500">{task.date}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {task.status}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-gray-700">{task.cost}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 py-2 text-sm font-semibold text-white shadow-md">
            View All Tasks
          </button>
          <button className="flex-1 rounded-lg border-2 border-cyan-300 bg-white/50 py-2 text-sm font-semibold text-cyan-700">
            Payment History
          </button>
        </div>
      </div>
    </FloatingBillboard>
  )
}
