import { useState, useEffect, useMemo, useCallback, useRef, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Filter, LogIn, Share2, UserPlus, Flame, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCarsInfinite, useCarCount } from '@/hooks/useCars'
import { useBrands } from '@/hooks/useBrands'
import { useOwners } from '@/hooks/useOwners'
import { useUserProfile } from '@/hooks/useUserProfile'
import { BrandSection } from '@/components/cars/BrandSection'
import { CarGridSkeleton } from '@/components/cars/CarGrid'
import { FAB, SearchBar, FilterSheet, WheelLoader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import type { Car, CarFilters } from '@/types'

interface HomePageProps {
  publicMode?: boolean
}

export function HomePage({ publicMode = false }: HomePageProps) {
  const { user, logout } = useAuth()
  const { userId: publicUserId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<CarFilters>({})
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [shareToast, setShareToast] = useState(false)
  const [allCollapsed, setAllCollapsed] = useState(false)
  const [toggleKey, setToggleKey] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [headerHeight, setHeaderHeight] = useState(0)
  const lastScrollY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Use public userId if in public mode, otherwise use logged in user
  const targetUserId = publicMode ? publicUserId : user?.uid

  const { data: carCount } = useCarCount(targetUserId)
  const { data: brands = [] } = useBrands(targetUserId)
  const { data: owners = [] } = useOwners(targetUserId)
  const { data: userProfile } = useUserProfile(publicMode ? publicUserId : undefined)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useCarsInfinite(targetUserId, filters)

  // Flatten all pages into a single array
  const allCars = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.cars)
  }, [data])

  // Group cars by brand
  const carsByBrand = useMemo(() => {
    const grouped = new Map<string, Car[]>()

    allCars.forEach((car) => {
      const brand = car.brand
      if (!grouped.has(brand)) {
        grouped.set(brand, [])
      }
      grouped.get(brand)!.push(car)
    })

    // Sort brands alphabetically
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [allCars])

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [handleObserver])

  // Measure header height
  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [])

  // Header hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY.current

      if (scrollDelta > 10 && currentScrollY > 100) {
        // Scrolling down
        setHeaderVisible(false)
      } else if (scrollDelta < -10) {
        // Scrolling up
        setHeaderVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/shared/${targetUserId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Hot Wheels Collection',
          text: 'Check out my Hot Wheels collection!',
          url: shareUrl,
        })
      } catch {
        // User cancelled or share failed, copy to clipboard instead
        await copyToClipboard(shareUrl)
      }
    } else {
      await copyToClipboard(shareUrl)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    }
  }

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined }))
  }

  const activeFilterCount = [filters.brand, filters.owner].filter(Boolean).length
  const hasActiveFilters = filters.search || filters.brand || filters.owner

  const handleToggleAll = () => {
    setAllCollapsed((prev) => !prev)
    setToggleKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-20 bg-hw-blue border-b border-hw-blue pt-safe transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {!publicMode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-white hover:bg-white/20"
              >
                <LogIn className="w-5 h-5 rotate-180" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-hw-orange" />
              <h1 className="text-xl font-bold text-white">
                {publicMode && userProfile?.name ? `${userProfile.name}'s Collection` : 'Hot Collection'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {publicMode ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/register')}
                className="bg-white text-hw-blue hover:bg-white/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-white hover:bg-white/20"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-2 px-4 pb-4">
          <span className="text-sm text-white/70 whitespace-nowrap">
            {hasActiveFilters ? allCars.length : (carCount ?? 0)} cars
          </span>
          <SearchBar
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="flex-1"
            variant="header"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFilterSheetOpen(true)}
            className="relative bg-white/20 text-white hover:bg-white/30"
          >
            <Filter className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-hw-orange text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4" style={{ paddingTop: headerHeight + 16 }}>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded-lg animate-pulse" />
            <CarGridSkeleton count={6} />
          </div>
        ) : allCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 mb-4 rounded-full bg-muted flex items-center justify-center">
              <img src="/wheel-icon.svg" alt="" className="w-12 h-12 opacity-50" />
            </div>
            <h2 className="text-lg font-medium mb-2">No cars yet</h2>
            <p className="text-muted-foreground mb-4">
              {filters.search || filters.brand || filters.owner
                ? 'No cars match your filters'
                : 'Start adding cars to your collection'}
            </p>
            {!filters.search && !filters.brand && !filters.owner && (
              <Button onClick={() => navigate('/create')}>Add Your First Car</Button>
            )}
          </div>
        ) : (
          <>
            {/* Toggle All Button */}
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleAll}
                className="text-muted-foreground"
              >
                {allCollapsed ? (
                  <>
                    <ChevronsUpDown className="w-4 h-4 mr-1" />
                    Expand All
                  </>
                ) : (
                  <>
                    <ChevronsDownUp className="w-4 h-4 mr-1" />
                    Collapse All
                  </>
                )}
              </Button>
            </div>

            {carsByBrand.map(([brand, cars]) => (
              <BrandSection
                key={`${brand}-${toggleKey}`}
                brand={brand}
                cars={cars}
                basePath={publicMode ? `/shared/${targetUserId}` : undefined}
                defaultExpanded={!allCollapsed}
              />
            ))}

            {/* Load more trigger */}
            <div ref={loadMoreRef} className="py-4">
              {isFetchingNextPage && (
                <div className="flex justify-center">
                  <WheelLoader size={32} />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* FAB - only show in non-public mode */}
      {!publicMode && <FAB onClick={() => navigate('/create')} />}

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm">Link copied to clipboard!</p>
        </div>
      )}

      {/* Filter Sheet */}
      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        onFiltersChange={setFilters}
        brands={brands}
        owners={owners}
      />
    </div>
  )
}
