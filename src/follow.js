const Plugin = require('./plugin')

module.exports = class Follow extends Plugin
{
    /**
     * @private
     * @param {Viewport} parent
     * @param {PIXI.DisplayObject} target to follow (object must include {x: x-coordinate, y: y-coordinate})
     * @param {object} [options]
     * @param {number} [options.speed=0] to follow in pixels/frame (0=teleport to location)
     * @param {number} [options.radius] radius (in world coordinates) of center circle where movement is allowed without moving the viewport
     */
    constructor(parent, target, options)
    {
        super(parent)
        options = options || {}
        this.speed = options.speed || 0
        this.target = target
        this.radius = options.radius
    }

    update()
    {
        if (this.paused)
        {
            return
        }

        const center = this.parent.center
        let toX = this.target.x, toY = this.target.y
        if (this.radius)
        {
            const distance = Math.sqrt(Math.pow(this.target.y - center.y, 2) + Math.pow(this.target.x - center.x, 2))
            if (distance > this.radius)
            {
                const angle = Math.atan2(this.target.y - center.y, this.target.x - center.x)
                toX = this.target.x - Math.cos(angle) * this.radius
                toY = this.target.y - Math.sin(angle) * this.radius
            }
            else
            {
                return
            }
        }
        const deltaX = toX - center.x
        const deltaY = toY - center.y
        if (deltaX || deltaY)
        {
            if (this.speed)
            {
                const angle = Math.atan2(toY - center.y, toX - center.x)
                const changeX = Math.cos(angle) * this.speed
                const changeY = Math.sin(angle) * this.speed
                const x = Math.abs(changeX) > Math.abs(deltaX) ? toX : center.x + changeX
                const y = Math.abs(changeY) > Math.abs(deltaY) ? toY : center.y + changeY
                this.parent.moveCenter(x, y)
                this.parent.emit('moved', { viewport: this.parent, type: 'follow' })
            }
            else
            {
                this.parent.moveCenter(toX, toY)
                this.parent.emit('moved', { viewport: this.parent, type: 'follow' })
            }
        }
    }
}